export default function SortAZ(data) {
  let names = [];
  for (let obj = 0; obj < data.length; obj += 1) {
    names.push(data[obj]["name"]);
  }

  names.sort(function (a, b) {
    if (a.toLowerCase() < b.toLowerCase()) {
      return -1;
    } else {
      return 1;
    }
  });

  let sortFlatArr = [];
  for (let name = 0; name < names.length; name += 1) {
    for (let obj = 0; obj < data.length; obj += 1) {
      if (names[name] === data[obj]["name"]) {
        sortFlatArr.push(data[obj]);
        break;
      }
    }
  }
  return sortFlatArr;
}
