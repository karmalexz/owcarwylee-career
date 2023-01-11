export const ago = (dateStr) => {
  let relative = (new Date() - new Date(dateStr)) / 1000;
  if (relative > 0 && relative < 60) {
    const seconds = relative;
    return seconds > 1 ? seconds + " seconds ago" : "a second ago";
  } else if (relative >= 60 && relative < 60 * 60) {
    const minutes = parseInt(relative / 60);
    return minutes > 1 ? minutes + " minutes ago" : "a minute ago";
  } else if (relative >= 60 * 60 && relative < 60 * 60 * 24) {
    const hours = parseInt(relative / (60 * 60));
    return hours > 1 ? hours + " hours ago" : "a hour ago";
  } else if (relative >= 60 * 60 * 24 && relative < 60 * 60 * 24 * 30) {
    const days = parseInt(relative / (60 * 60 * 24));
    return days > 1 ? days + " days ago" : "a day ago";
  } else if (relative >= 60 * 60 * 24 * 30 && relative < 60 * 60 * 24 * 30 * 12) {
    const months = parseInt(relative / (60 * 60 * 24 * 30));
    return months > 1 ? months + " months ago" : "a month ago";
  } else {
    const years = parseInt(relative / (60 * 60 * 24 * 30 * 12));
    return years > 1 ? years + " years ago" : "a year ago";
  }
}

export const distance = (a, b) => {
  const p = 0.017453292519943295;
  const c = Math.cos;
  const result = 0.5 - c((b.lat - a.lat) * p)/2 + 
          c(a.lat * p) * c(b.lat * p) * 
          (1 - c((b.lng - a.lng) * p))/2;
  return 12742 * Math.asin(Math.sqrt(result));
}

export const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
}