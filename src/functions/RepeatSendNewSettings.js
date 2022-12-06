export default async function RepeatSendNewSettings() {
  if (localStorage.getItem("filesArr")) {
    let arr = JSON.parse(localStorage.getItem("filesArr"));

    if (arr.length > 0) {
      let cnt = 0;
      for (let obj = 0; obj < arr.length; obj += 1) {
        let settings = {
          name: arr[obj]["name"],
          password: arr[obj]["password"],
          settings: arr[obj]["settings"],
        };
        try {
          const sendSettings = await fetch(
            `http://localhost:5000/${settings.name}Settings`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(settings),
            }
          );
          if (sendSettings.ok) {
            cnt += 1;
          }
        } catch (err) {
          if (String(err).includes("Failed to fetch")) {
            return;
          }
        }
      }
      if (cnt === arr.length) {
        localStorage.setItem("filesArr", JSON.stringify([]));
      }
    }
  }
}
