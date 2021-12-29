/**
 * @name gravityEncode
 * @function
 * @param array
 * @example
 * const encodeStr = gravityEncode([{name: "Alex"},{name: "Abbas"}])
 * @returns {String}
 */
export function gravityEncode(array: Array<object>): String {
  // Generate the text
  let entriesString = `a:${array.length}:{`;
  array.map((entry: any, index: number): void => {
    // Collect the keys from object
    const entryKeys = Object.keys(entry);
    // Append the object information to base text
    entriesString += `i:${index};a:${entryKeys.length}:{`;
    entryKeys.map((key: string) => {
      // Embed values to base string
      entriesString += `s:${new TextEncoder().encode(key).length}:"${key}";s:${
        new TextEncoder().encode(entry[key]).length
      }:"${entry[key]}";`;
    });
    entriesString += "}";
  });
  // Close the String
  entriesString += "}";
  return entriesString;
}

/**
 * @description gravity array decode
 * @function
 * @param {string} array
 * @returns {Object[]}
 */
export function gravityDecode(gravityString: String): Object {
  if (!gravityString) return [];
  let currectArray: Array<object> = [];
  // Collect the data from dirty string
  let stringArray = gravityString.match(/{(s:([0-9])*:"(\W+)*"\;)*}/gm);
  // Check if anything fined
  if (stringArray) {
    // Delete the junk information
    stringArray.map((data: String, key: number) => {
      if (stringArray) {
        stringArray[key] = data.replaceAll("s:", "");
        stringArray[key] = stringArray[key].replaceAll(";", ",");
      }
    });
    // Extract the correct data from string
    stringArray.map((data: String) => {
      // Grab all of the data
      const values = data.match(/[0-9]{1,}:"\W+",[0-9]{1,}:"\W+",/gm);
      let currectData: Object = {};
      if (values) {
        // Remove the junk texts and submit the real data to currectData
        values.map((data) => {
          const junkData = data.match(/([\D]{1,})/gm);
          let realData: Array<String> = [];
          if (junkData) {
            junkData.map((junk) => {
              junk = junk.replaceAll('"', "");
              junk = junk.replaceAll(":", "");
              junk = junk.replaceAll(",", "");
              realData.push(junk);
            });
          }
          //   ts-ignore
          currectData[realData[0]] = realData[1];
        });
      }
      // save the currect array
      currectArray = [...currectArray, currectData];
    });
  }
  return currectArray;
}
