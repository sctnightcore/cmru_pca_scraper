module.exports = {
  getPoint: async (like, share) => {
    return 1;
  },
  getLike: async (page) => {
    let elHandle = await page.$x(
      "/html/body/div[1]/div/div[3]/div[1]/div/div/div[5]/div[2]/div/div/div[2]/a[2]"
    );
    let like = await page.evaluate((el) => el.textContent, elHandle[0]);
    return Number(like.replace(/\D/g, "")) + 1;
  },
  getShare: async (page) => {
    let elHandle = await page.$x(
      "/html/body/div[1]/div/div[3]/div[1]/div/div/div[5]/div[2]/div/div/div[3]/a/span"
    );
    let share = await page.evaluate((el) => el.textContent, elHandle[0]);
    return Number(share.replace(/\D/g, ""));
  },
};
