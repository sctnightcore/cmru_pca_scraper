require("dotenv").config();
const puppeteer = require("puppeteer");

const log = require("./src/log");
const fb = require("./src/fb");

const dateTime = new Date().toLocaleString({ timeZone: "Asia/Bangkok" });
const timeStemp = new Date(dateTime).getTime();

const update_HistoryData_by_Id = async (key, id, value, historyData) => {
  let index = historyData[key].findIndex((o) => o["name"] === id);
  if (index !== -1) {
    historyData[key][index]["data"].push([timeStemp, value]);
    return;
  }
  historyData[key].push({ name: id, data: [[timeStemp, value]] });
  return;
};

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
    console.log(`[CONSOLE][${i["id"]}] Read Data`);

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
    console.log(`[CONSOLE][${i["id"]}] Update HistoryData point_data`);
    await update_HistoryData_by_Id(
      "point_data",
      i["id"],
      i["all_point"],
      historyData
    );

    console.log(`[CONSOLE][${i["id"]}] Update HistoryData like_data`);
    await update_HistoryData_by_Id(
      "like_data",
      i["id"],
      i["all_like"],
      historyData
    );

    console.log(`[CONSOLE][${i["id"]}] Update HistoryData share_data`);
    await update_HistoryData_by_Id(
      "share_data",
      i["id"],
      i["all_share"],
      historyData
    );

    console.log(
      `[CONSOLE][${i["id"]}] POINT: ${i["all_point"]} LIKE: ${i["all_like"]} SHARE: ${i["all_share"]}`
    );
  }

  await browser.close();
  await log.writeFile("Member.json", memberData);
  await log.writeFile("History.json", historyData);
  return true;
};

main();
