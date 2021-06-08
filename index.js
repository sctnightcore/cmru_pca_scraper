require("dotenv").config();
const puppeteer = require("puppeteer");

const log = require("./src/log");
const fb = require("./src/fb");

const dateTime = new Date().toLocaleString({ timeZone: "Asia/Bangkok" });
const timeStemp = new Date(dateTime).getTime();

const main = async () => {
  // read Data
  let memberData = await log.readFile("Member.json");
  if (!memberData) return console.log("[ERROR] Member.json not Found!");

  let historyData = await log.readFile("History.json");
  if (!historyData) return console.log("[ERROR] History.json not Found!");

  console.log("[CONSOLE] Read All MemberData");

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  for (let i of memberData) {
    console.log(`[CONSOLE] Read ${i["id"]} Data`);

    // go to page id
    await page.goto(i["url"], { waitUntil: "networkidle2" });

    // get Like
    let like = await fb.getLike(page);

    // get share
    let share = await fb.getShare(page);

    // get point
    let point = await fb.getPoint(like, share);

    // update member data
    i["all_point"] = point;
    i["all_like"] = like;
    i["all_share"] = share;

    // update History date

    let index;
    // update Point Data chart js
    index = historyData["point_data"].findIndex((o) => o.name === i["id"]);
    if (index === -1) {
      // check if object is exist
      historyData["point_data"].push({
        name: i["id"],
        data: [[timeStemp, i["all_point"]]],
      });
    } else {
      // push new data to object with index
      historyData["point_data"][index]["data"].push([
        timeStemp,
        i["all_point"],
      ]);
    }

    // update Like Data
    index = historyData["like_data"].findIndex((o) => o.name === i["id"]);
    if (index === -1) {
      // check if object is exist
      historyData["like_data"].push({
        name: i["id"],
        data: [[timeStemp, i["all_like"]]],
      });
    } else {
      // push new data to object with index
      historyData["like_data"][index]["data"].push([
        timeStemp,
        i["all_like"],
      ]);
    }

    // update Like Data
    index = historyData["share_data"].findIndex((o) => o.name === i["id"]);
    if (index === -1) {
      // check if object is exist
      historyData["share_data"].push({
        name: i["id"],
        data: [[timeStemp, i["all_share"]]],
      });
    } else {
      // push new data to object with index
      historyData["share_data"][index]["data"].push([
        timeStemp,
        i["all_share"],
      ]);
    }

    console.log(
      `[CONSOLE] ${i["id"]} POINT: ${i["all_point"]} LIKE: ${i["all_like"]} SHARE: ${i["all_share"]}`
    );

  }

  await browser.close();
  await log.writeFile("Member.json", memberData);
  await log.writeFile("History.json", historyData);
  return true;
};

main();
