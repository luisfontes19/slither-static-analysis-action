import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';
const VERSION = core.getInput("slither-version") || "0.6.14";
const NPM_INSTALL = core.getInput("run-npm-install") === "true";


const failOnHighResults = parseInt(core.getInput("failOnHighResults")) || 1;
const failOnMediumResults = parseInt(core.getInput("failOnMediumResults")) || 1;
const failOnLowResults = parseInt(core.getInput("failOnLowResults")) || 1;
const failOnInformativeResults = parseInt(core.getInput("failOnInformativeResults")) || 10;
const failOnOptimizationResults = parseInt(core.getInput("failOnOptimizationResults")) || 1;

type Severity = "High" | "Medium" | "Low" | "Informational" | "Optimization";

const run = async () => {


  const counts = { "High": 0, "Medium": 0, "Low": 0, "Informational": 0, "Optimization": 0 };


  // try {
  //   core.info("Install dependencies");
  //   await exec.exec("sudo apt-get install -y git python3 python3-setuptools wget software-properties-common");

  //   core.info("Downloading slither");
  //   await exec.exec(`wget https://github.com/crytic/slither/archive/${VERSION}.zip -O /tmp/slither.zip`);


  //   core.info("Unzipping slither");
  //   await exec.exec(" unzip /tmp/slither.zip -d .");


  //   core.info("Installing slither");
  //   await exec.exec("sudo python3 setup.py install", undefined, { cwd: `slither-${VERSION}` });


  //   if (NPM_INSTALL) {
  //     core.info("Installing dependencies");
  //     await exec.exec("npm install");
  //   }
  // }
  // catch (ex) {
  //   core.setFailed("Something went wrong. Check above for more information");
  //   return;
  // }



  console.log("Running static scan");
  const output = await fs.readFileSync("/private/tmp/asd.json").toString();

  try {
    const data = JSON.parse(output);

    if (!data.success) {
      core.setFailed("Something went wrong...");
      return;
    }

    if (data.results.length === 0) {
      core.info("All good");
      return;
    }

    data.results.detectors.forEach((d: any) => {
      const severity = d.impact as Severity;
      counts[severity]++;

      console.log(`[${d.impact}] ${d.check}:`);
      console.log(d.description);
      console.log("");
    });


    console.log("----------------------------------------");
    console.log("                  Stats")
    console.log("----------------------------------------");
    console.log(`High:          ${counts["High"]}`);
    console.log(`Medium:        ${counts["Medium"]}`);
    console.log(`Low:           ${counts["Low"]}`);
    console.log(`Informative:   ${counts["Informational"]}`);
    console.log(`Optimizations: ${counts["Optimization"]}`);
    console.log("----------------------------------------");

    if (failOnHighResults !== 0 && failOnHighResults <= counts["High"])
      core.setFailed(`Number of High results is equal or bigger then the defined threshold of ${failOnHighResults}`);
    else if (failOnMediumResults !== 0 && failOnMediumResults <= counts["Medium"])
      core.setFailed(`Number of Medium results is equal or bigger then the defined threshold of ${failOnMediumResults}`);
    else if (failOnLowResults !== 0 && failOnLowResults <= counts["Low"])
      core.setFailed(`Number of Low results is equal or bigger then the defined threshold of ${failOnLowResults}`);
    else if (failOnInformativeResults !== 0 && failOnInformativeResults <= counts["Informational"])
      core.setFailed(`Number of Informative results is equal or bigger then the defined threshold of ${failOnInformativeResults}`);
    else if (failOnOptimizationResults !== 0 && failOnOptimizationResults <= counts["Optimization"])
      core.setFailed(`Number of Optimization results is equal or bigger then the defined threshold of ${failOnOptimizationResults}`);
  }
  catch (ex) {
    core.setFailed("Error parsing results");
    console.debug(ex);
    return;
  }
}

const runSlither = async (): Promise<string> => {
  //slither return code is the number of findings... 
  return new Promise((resolve, reject) => {
    let output = "";
    const options: exec.ExecOptions = {};
    options.listeners = {
      stdout: (data: Buffer) => output += data.toString()
    };

    exec.exec("slither . --json -", undefined, options).then(() => resolve(output)).catch(() => resolve(output));
  })


}


run();