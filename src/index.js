const puppeteer = require('puppeteer')
const fs = require('fs')

let members = require('../membersData.json');
let chartmembers = require('../chartMembersData.json')


async function getShare(page) {
    let elHandle = await page.$x('/html/body/div[1]/div/div[3]/div[1]/div/div/div[5]/div[2]/div/div/div[2]/a[2]')
    let share = await page.evaluate(el => el.textContent, elHandle[0]);
    return Number(share.replace(/\D/g, ""))
}

async function getLike(page) {
    let elHandle = await page.$x('/html/body/div[1]/div/div[3]/div[1]/div/div/div[5]/div[2]/div/div/div[3]/a/span')
    let like = await page.evaluate(el => el.textContent, elHandle[0]);
    return Number(like.replace(/\D/g, ""))
}

async function writeMembersFile() {
    return new Promise((resolve) => {
        fs.writeFile('membersData.json', JSON.stringify(members, null, 2), "utf8", resolve)
    })
}

async function writeChartMembersFile() {
    return new Promise((resolve) => {
        fs.writeFile('chartMembersData.json', JSON.stringify(chartmembers, null, 2), "utf8", resolve)
    })
}


async function main() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    const date = new Date().toLocaleString("th", { timeZone: "Asia/Bangkok" })
    for (let item of members) {
        await page.goto(item.url)

        // get Share
        let share = await getShare(page)
        // get Like
        let like = await getLike(page)

        // update 
        item.share = share
        item.like = like

        item.diff_like = (Number(item.like) - like)
        item.diff_share = (Number(item.share) - share)

        item.diff_like_status = (Number(item.like) === like) ? "SAME" : (like > Number(item.like)) ? "UP" : "DOWN"
        item.diff_like_share = (Number(item.share) === share) ? "SAME" : (share > Number(item.share)) ? "UP" : "DOWN"

        chartmembers[item.id].push({
            updatedAt: date,
            like: item.like,
            share: item.share
        })
    }

    // write file
    await writeMembersFile()
    await writeChartMembersFile()
    await browser.close();
}


main()