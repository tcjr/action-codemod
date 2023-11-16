import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { createFiles, findFiles } from '@codemod-utils/files';

import type { Options } from '../types/index.js';

// Given an hbs file path, return the path to the backing component if it exists.
function getBackingComponentFilePath(
  hbsFilePath: string,
  projectRoot: string,
): string | undefined {
  let componentFilePath = hbsFilePath.replace(/\.hbs$/, '.js');

  let found = findFiles(componentFilePath, { projectRoot });
  if (found.length === 0) {
    componentFilePath = hbsFilePath.replace(/\.hbs$/, '.ts');
    found = findFiles(componentFilePath, { projectRoot });
    if (found.length === 0) {
      return undefined;
    }
  }
  if (found.length > 1) {
    //throw new Error(`Found multiple files for ${componentFilePath}`);
    return undefined;
  }

  return found[0];
}

export function showComponentPairs(options: Options): void {
  const { projectRoot } = options;

  const filePaths = findFiles('**/*.hbs', {
    projectRoot,
  });

  console.log(`Files (${filePaths.length}):`, filePaths);

  filePaths.forEach((filePath) => {
    console.log(`Checking ${filePath}`);
    const componentFilePath = getBackingComponentFilePath(
      filePath,
      projectRoot,
    );
    if (componentFilePath) {
      console.log(`  Backing class ${componentFilePath}`);
    } else {
      console.log(`  No backing class`);
    }
  });
}
