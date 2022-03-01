/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("\n//fetch API\nvar api_url = 'https://api.esv.org/v3/passage/html/?q='\nconst options = {\n  headers: {\n    Authorization: \"Token abefecf1787b77af8b490d6056e2691433f6d3d4\"\n  }\n};\nlet next = [];\nlet prev = [];\n\n//display text\nasync function getTXT(mode) {\n  let params = {\n    'include-chapter-numbers': 'False',\n    'include-audio-link': 'False'\n  }\n  var request;\n  // From Text Input\n  if (mode == 1) {\n    //var str1 = document.getElementById(\"book\").value;\n    var str = document.getElementById(\"reference\").value;\n    request = api_url + str;\n    // Next Chapter\n  } else if (mode == 0) {\n    request = api_url + next.join('-');\n    // Previous Chapter\n  } else if (mode == 2) {\n    request = api_url + prev.join('-');\n    // Default upon launch\n  } else if (mode == 3) {\n    request = api_url + \"Genesis1\";\n  }\n  console.log(request);\n\n  const response = await fetch(request + \"&\" + (new URLSearchParams(params)).toString(), options);\n  const data = await response.json();\n  console.log(data);\n  \n  if (data.canonical === \"\") {\n    getSRC();\n  } else {\n    document.getElementById(\"main\").innerHTML = data.passages;\n    next = data.passage_meta[0].next_chapter;\n    prev = data.passage_meta[0].prev_chapter;\n  }\n\n  document.getElementById(\"reference\").value = \"\";\n\n}\n\n//Get Search Results\nasync function getSRC() {\n  let params = {\n    'page_size' : '100'\n  }\n  var str = document.getElementById(\"reference\").value;\n  var request = \"https://api.esv.org/v3/passage/search/?q=\" + str;\n  const response = await fetch(request + \"&\" + (new URLSearchParams(params)).toString(), options);\n  const data = await response.json();\n  // document.getElementById(\"main\").innerHTML = data.results[1].reference;\n  // document.getElementById(\"main\").innerHTML += data.results[1].reference;\n\n  console.log(data);\n  document.getElementById(\"main\").innerHTML = \"\";\n  for (let i = 0; i < data.total_results; i++) {\n    document.getElementById(\"main\").innerHTML += data.results[i].reference + \"<br>\" + data.results[i].content + \"<br><br>\";\n  }\n\n}\n\n// Proceed on 'Enter' Key\nvar navBox = document.getElementById(\"reference\");\n// navBox.addEventListener(\"keydown\", (event) => {\n//   if (event.key === \"Enter\") {\n//     document.getElementById(\"toggleVerse\").click();\n//     getTXT(1);\n//   }\n// });\n\nnavBox.addEventListener(\"keypress\", handleEnter, false);\n\nfunction handleEnterRef() {\n  if(event.key == \"Enter\") {\n    event.preventDefault();\n    document.getElementById(\"toggleVerse\").click();\n  }\n}\n\nfunction handleEnterSRC() {\n  if(event.key == \"Enter\") {\n    event.preventDefault();\n    document.getElementById(\"Search\").click();\n  }\n}\n\n//darkmode\nfunction darkmode() {\n  var element = document.body;\n  element.classList.toggle(\"darkmode\");\n}\n\n\n\n//# sourceURL=webpack://cuneiform/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;