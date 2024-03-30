#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { readFile, writeFile } = require('fs/promises');

const packageName = 'node-express-ts-boilerplate';
const gitRepo = `https://github.com/vigneshdemitro/${packageName}.git`;

const checkInputs = () => {
    if (process.argv.length < 3) {
        console.log('Kindly provide app name');
        console.log(`Example npx ${packageName} my-app`);
        process.exit(1);
    }
}

const parseInputs = () => {
    const projectName = process.argv[2];
    const currentPath = process.cwd();
    const projectPath = path.join(currentPath, projectName);

    return { projectName, projectPath };
}

const createProjectFolder = ({ projectPath, projectName }) => {
    try {
        fs.mkdirSync(projectPath);
    } catch (error) {
        if (error.code === 'EEXIST') {
            console.log(
                `The folder ${projectName} already exist in the current directory, please give it another name.`,
            );
        } else {
            console.log(error);
        }
        process.exit(1);
    }
};


const runCommand = (command) => {
    try {
        execSync(command, { stdio: 'inherit', encoding: 'utf-8' });
        return true;
    } catch (error) {
        console.error(`Error occured while executing : ${command}`, error);
        return false;
    }
}

const cloneRepo = (projectPath) => {
    console.log('Downloading files...');
    const gitCommand = `git clone --depth 1 ${gitRepo} ${projectPath}`;
    runCommand(gitCommand);
    process.chdir(projectPath);
};

const installDependencies = () => {
    console.log('Installing Dependencies');
    runCommand(`npm install`);
}

const removeExtraFiles = async ({ projectName, projectPath }) => {
    console.log('Tidying up the directory');
    fs.rmSync(path.join(projectPath, '.git'), { recursive: true });
    fs.rmSync(path.join(projectPath, 'bin'), { recursive: true });
    let packageJSONData = await readFile(path.join(projectPath, 'package.json'));
    const packageJSON = JSON.parse(packageJSONData);
    packageJSON.name = projectName;
    packageJSON.version = '1.0.0';
    packageJSON.description = `Created with @vigneshdemitro/${packageName}`;
    delete packageJSON['keywords'];
    delete packageJSON['bugs'];
    delete packageJSON['homepage'];
    delete packageJSON['repository'];
    delete packageJSON['bin'];
    packageJSONData = JSON.stringify(packageJSON, null, 2);
    await writeFile(path.join(projectPath, 'package.json'), packageJSONData);
};

async function main() {
    try {
        checkInputs();
        const { projectName, projectPath } = parseInputs();
        createProjectFolder({ projectName, projectPath });
        cloneRepo(projectPath);
        await removeExtraFiles({ projectName, projectPath });
        installDependencies()
        console.log(`Congratulations, your app is ready to use`)
        console.log(`Navigate:\n cd ${projectPath}`)
        console.log(`Start app:\n npm run dev`)
    } catch (error) {
        console.error(`Unexpected error happened`, error);
    }

}

main();