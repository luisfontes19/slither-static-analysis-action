import * as core from '@actions/core';
import * as exec from '@actions/exec';
//import * as github from '@actions/github';


//TODO: make it an input
const VERSION = core.getInput("slither-version");
const NPM_INSTALL = core.getInput("run-npm-install") === "true";

const run = async () => {

  let output = "", error = "";

  const options: exec.ExecOptions = {};
  options.listeners = {
    stdout: (data: Buffer) => output += data.toString(),
    stderr: (data: Buffer) => error += data.toString()
  };

  try {
    console.log("Install dependencies");
    await exec.exec("sudo apt-get install -y git python3 python3-setuptools wget software-properties-common");

    console.log("Downloading slither");
    await exec.exec(`wget https://github.com/crytic/slither/archive/${VERSION}.zip -O /tmp/slither.zip`);


    console.log("Unzipping slither");
    await exec.exec(" unzip /tmp/slither.zip -d .");


    console.log("Installing slither");
    await exec.exec("sudo python3 setup.py install", undefined, { cwd: `slither-${VERSION}` });


    if (NPM_INSTALL) {
      console.log("Installing dependencies");
      await exec.exec("npm install");
    }
  }
  catch (ex) {
    core.setFailed("Something went wrong. Check above for more information");
    return;
  }


  try {
    console.log("Running static scan");
    await exec.exec("slither", ["."], options);
  }
  catch (ex) {
    core.setFailed("Slither found possible issues that need your attention");
    core.setOutput("issues", output);
    console.debug(ex);
  }
}


run();