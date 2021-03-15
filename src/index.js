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

async function main() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();

    const date = new Date().toLocaleDateString("th", { timeZone: "Asia/Bangkok" })
    const time = new Date().toLocaleTimeString("th", { timeZone: "Asia/Bangkok" })
    const date_time = `${new Date().toLocaleDateString("th", { timeZone: "Asia/Bangkok" })}:${new Date().toLocaleString("th", { timeZone: "Asia/Bangkok" })}`

    let members = await readMembersData()
    let history = await readHistoryData()

    console.log("Update all Members")
    // update member
    for (let item of members) {
        await page.goto(item.url)

        // get Share
        let share = await getShare(page)
        // get Like
        let like = await getLike(page)

        // update member data
        item.share = share.toString()
        item.like = like.toString()

        item.point = (Number(item.like) + (Number(item.share) * 3)).toString()

        item.diff_like = (Number(item.like) - like).toString()
        item.diff_share = (Number(item.share) - share).toString()

        item.diff_like_status = (Number(item.like) === like) ? "SAME" : (like > Number(item.like)) ? "UP" : "DOWN"
        item.diff_like_share = (Number(item.share) === share) ? "SAME" : (share > Number(item.share)) ? "UP" : "DOWN"

    }

    console.log("Update History")
    // update history
    // if array dont exist
    if (typeof (history[date]) === "undefined") {
        history[date] = {}
        history[date]['day'] = {}
        history[date]['time'] = {}
        history[date]['time'][time] = {}
    }

    // update history [ day ]
    history[date]['day'] = members.map(el => ({
        id: el.id, point: el.point, like: el.like, share: el.share
    }))

    // update history [ time ]

    history[date]['time'][time] = members.map(el => ({
        id: el.id, point: el.point, like: el.like, share: el.share
    }))

    console.log("Update last 5 history of day")

    // last_history_time
    for (let item of members) {
        for (let i in history[date]['time']) {
            history[date]['time'][i].map(el => {
                if (el.id === item.id) {
                    if (Object.keys(item.last_history_time).length > 4) {
                        item.last_history_time.pop()
                    }
                    item.last_history_time.push({
                        date: date,
                        time: i,
                        point: el.point,
                        like: el.like,
                        share: el.share
                    })
                }
            })
        }
    }

    // last_history_day
    console.log("Update all history")
    for (let item of members) {
        for (let i in history) {
            history[i]['day'].map(el => {
                if (el.id === item.id) {
                    let checked = item.last_history_day.some((e) => e.updateAt === i)
                    if (!checked) {
                        item.last_history_day.push({
                            updateAt: i.toString(),
                            point: el.point,
                            like: el.like,
                            share: el.share
                        })
                    }
                }
            })
        }
    }

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
