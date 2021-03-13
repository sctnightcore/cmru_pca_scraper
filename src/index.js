const puppeteer = require('puppeteer')
const fs = require('fs');

async function readMembersData() {
    return new Promise((resolve) => {
        fs.readFile('membersData.json', 'utf8', (err, data) => {
            if (err) return resolve([])
            const json = JSON.parse(data)
            return resolve(json)
        })
    })
}

async function readHistoryData() {
    return new Promise((resolve) => {
        fs.readFile('HistoryData.json', 'utf8', (err, data) => {
            if (err) return resolve([])
            const json = JSON.parse(data)
            return resolve(json)
        })
    })
}

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

async function writeMembersFile(members) {
    return new Promise((resolve) => {
        fs.writeFile('membersData.json', JSON.stringify(members, null, 2), "utf8", resolve)
    })
}

async function writeHistoryFile(history) {
    return new Promise((resolve) => {
        fs.writeFile('HistoryData.json', JSON.stringify(history, null, 2), "utf8", resolve)
    })
}


async function main() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();

    const date = new Date().toLocaleDateString("th", { timeZone: "Asia/Bangkok" })
    const time = new Date().toLocaleTimeString("th", { timeZone: "Asia/Bangkok" })
    const date_time = `${new Date().toLocaleDateString("th", { timeZone: "Asia/Bangkok" })}:${new Date().toLocaleString("th", { timeZone: "Asia/Bangkok" })}`

    let members = await readMembersData()
    let history = await readHistoryData()

    // update member
    for (let item of members.members) {
        await page.goto(item.url)

        // get Share
        let share = await getShare(page)
        // get Like
        let like = await getLike(page)

        // update member data
        item.share = share
        item.like = like

        item.point = (Number(item.like) + (Number(item.share) * 3))

        item.diff_like = (Number(item.like) - like)
        item.diff_share = (Number(item.share) - share)

        item.diff_like_status = (Number(item.like) === like) ? "SAME" : (like > Number(item.like)) ? "UP" : "DOWN"
        item.diff_like_share = (Number(item.share) === share) ? "SAME" : (share > Number(item.share)) ? "UP" : "DOWN"

    }

    // update history
    history[date].push({
        updatedAt: time,
        members: members.members.map(el => ({
            id: el.id, point: el.point, like: el.like, share: el.share
        }))
    })

    // write file
    await writeMembersFile(members)
    await writeHistoryFile(history)
    await browser.close();
}


main()

// sort point 
//console.log(members.sort((a, b) => (a.point < b.point) ? 1 : -1))

// like to list
//console.log(members.map((el) => el.like))

    //
    // console.log(Object.keys(history).toString())
    // update history data for chart ?

    // update chart label 1 day ?

    //members.chart_label = history[date].map(el => el.updatedAt)
