export default async function SendNewSettings(user) {
  let currentUser = {
    name: user.name,
    password: user.password,
    settings: user.settings,
  };

  const handleErrSend = (failed) => {
    localStorage.setItem(
      `${currentUser.name}/${currentUser.password}Settings`,
      JSON.stringify(currentUser.settings)
    );

    if (String(failed).includes("Failed to fetch")) {
      if (localStorage.getItem("filesArr")) {
        let existArr = JSON.parse(localStorage.getItem("filesArr"));
        if (existArr.length === 0) {
          existArr.push(currentUser);
        }
        if (existArr.length !== 0) {
          let cnt = 0;
          for (let obj = 0; obj < existArr.length; obj += 1) {
            if (
              existArr[obj]["name"] === currentUser.name &&
              existArr[obj]["password"] === currentUser.password
            ) {
              existArr[obj]["settings"] = currentUser.settings;
              cnt += 1;
            }
          }
          if (cnt === 0) {
            existArr.push(currentUser);
          }
        }
        localStorage.setItem("filesArr", JSON.stringify(existArr));
      }
      if (!localStorage.getItem("filesArr")) {
        let filesArr = [];
        filesArr.push(currentUser);
        localStorage.setItem("filesArr", JSON.stringify(filesArr));
      }
    }
  };

  try {
    await fetch(`http://localhost:5000/${currentUser.name}Settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentUser),
    });
    localStorage.setItem(
      `${currentUser.name}/${currentUser.password}Settings`,
      JSON.stringify(currentUser.settings)
    );
  } catch (err) {
    handleErrSend(err);
  }
}
