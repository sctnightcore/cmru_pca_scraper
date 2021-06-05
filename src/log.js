const fs = require("fs").promises;

module.exports = {
  readFile: async (filename) => {
    try {
      let raw_data = await fs.readFile(
        `./log/${process.env.YEAR}/${filename}`,
        "utf-8"
      );
      let raw_json = JSON.parse(raw_data);
      return raw_json;
    } catch (err) {
      return false;
    }
  },
  writeFile: async (filename, raw_data) => {
    try {
      let result = await fs.writeFile(
        `./log/${process.env.YEAR}/${filename}`,
        JSON.stringify(raw_data, null, 2),
        "utf8"
      );
    } catch (err) {
      return false;
    }
  },
};
