import{searchButtonClicked} from './main.js';
    // 1
    window.onload = (e) => {
        document.querySelector("#search").onclick = searchButtonClicked,
        document.querySelector("#moreSearch").onclick = searchButtonClicked};