import { execSync } from 'node:child_process';

const runCommand = (command) => {
    try {
        execSync(command, { stdio: 'inherit', encoding: 'utf-8' });
    } catch (error) {
        console.error(`Error occured while executing : ${command}`, error)
    }
}

const defaultRepoName = 'server';
const repoName = process.argv[2] || defaultRepoName;

const gitCommand = `git clone --depth 1 https://github.com/vigneshdemitro/node-express-ts-boilerplate.git ${repoName}`;
const installDeps = `cd ${repoName} && npm install`;

console.log(`Cloning into ${repoName}`);
const checkedOut = runCommand(gitCommand);
if (!checkedOut) {
    console.error(`Error in cloning repo`);
    process.exit(-1);
}

console.log(`Installing dependencies in ${repoName}`);
const installPackages = runCommand(installDeps);

if (!installPackages) {
    console.error(`Error in installing dependencies`);
    process.exit(-1);
}

console.log(`Congragulations your app is ready to use`)
console.log(`Navigate: cd ${repoName}`)
console.log(`Start app: npm run dev`)