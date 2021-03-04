import * as core from '@actions/core';
import * as exec from '@actions/exec';

const slitherVersion = core.getInput("slither-slitherVersion") || "0.6.14";
const runNpmInstall = core.getInput("run-npm-install") === "true";
const failOnHighResults = parseInt(core.getInput("high-threshold")) || 1;
const failOnMediumResults = parseInt(core.getInput("medium-threshold")) || 1;
const failOnLowResults = parseInt(core.getInput("low-threshold")) || 1;
const failOnInformativeResults = parseInt(core.getInput("informative-threshold")) || 10;
const failOnOptimizationResults = parseInt(core.getInput("optimization-threshold")) || 1;
const slitherParams = core.getInput("slither-params") || "";
const projectPath = core.getInput("projectPath") || ".";

type Severity = "High" | "Medium" | "Low" | "Informational" | "Optimization";

const run = async () => {


  const counts = { "High": 0, "Medium": 0, "Low": 0, "Informational": 0, "Optimization": 0 };

  printDebugInfo();

  try {
    await prepare();
  }
  catch (ex) {
    core.setFailed("Something went wrong. Check above for more information");
    return;
  }

  console.log("Running static scan");
  const output = await runSlither();

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

    // console.log("")
    // console.log("----------------------------------------");
    // console.log("                Findings")
    // console.log("----------------------------------------");
    (data.results.detectors || "").forEach((d: any) => {
      const severity = d.impact as Severity;
      counts[severity]++;

      core.error(`[${d.impact}] ${d.check}:\n${d.description}\n`);
      // console.log(`[${d.impact}] ${d.check}:`);
      // console.log(d.description);
      // console.log("");
    });


    showStats(counts);
  }
  catch (ex) {
    core.setFailed("Error parsing results");
    console.debug(ex);
    return;
  }
}

const prepare = async () => {
  core.info("Install dependencies");
  await exec.exec("sudo apt-get install -y git python3 python3-setuptools wget software-properties-common");

  core.info("Downloading slither");
  await exec.exec(`wget https://github.com/crytic/slither/archive/${slitherVersion}.zip -O /tmp/slither.zip`);


  core.info("Unzipping slither");
  await exec.exec(" unzip /tmp/slither.zip -d .");


  core.info("Installing slither");
  await exec.exec("sudo python3 setup.py install", undefined, { cwd: `slither-${slitherVersion}` });


  if (runNpmInstall) {
    core.info("Installing dependencies");
    await exec.exec("npm install", undefined, { cwd: projectPath });
  }
}

const printDebugInfo = () => {
  core.debug("Configs:");
  core.debug("slitherVersion: " + slitherVersion);
  core.debug("failOnHighResults: " + failOnHighResults);
  core.debug("failOnMediumResults: " + failOnMediumResults);
  core.debug("failOnLowResults: " + failOnLowResults);
  core.debug("failOnInformativeResults: " + failOnInformativeResults);
  core.debug("failOnOptimizationResults: " + failOnOptimizationResults);
  core.debug("projectPath: " + projectPath);
  core.debug("runNpmInstall: " + runNpmInstall);
}

const runSlither = async (): Promise<string> => {
  //slither return code is the number of findings... 
  return new Promise((resolve, reject) => {
    let output = "";
    const options: exec.ExecOptions = {};
    options.listeners = {
      stdout: (data: Buffer) => output += data.toString()
    };
    options.cwd = projectPath;

    exec.exec("slither --json - . " + slitherParams, undefined, options).then(() => resolve(output)).catch(() => resolve(output));
  })
}

//TODO: replace any
const showStats = (counts: any) => {
  core.warning(
    `----------------------------------------
                  Stat
----------------------------------------
High:          ${counts["High"]}
Medium:        ${counts["Medium"]}
Low:           ${counts["Low"]}
Informative:   ${counts["Informational"]}
Optimizations: ${counts["Optimization"]}
----------------------------------------`);

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


run();