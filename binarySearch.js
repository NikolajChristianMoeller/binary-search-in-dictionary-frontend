"use strict";

const endpoint = "http://localhost:8080/ordbogen";

async function getSizes() {
  const response = await fetch(endpoint);
  const json = await response.json();
  return json;
}

async function getEntryAt(index) {
  const response = await fetch(`${endpoint}/${index}`);
  if (response.ok) {
    const entry = await response.json();
    return entry;
  } else {
    throw new Error("Entry not found.");
  }
}

async function binarySearch(searchTerm) {
    const {min, max} = await getSizes();
    let start = min;
    let end = max;
    let iterations = 0;

    const startTime = performance.now();

    while (start <= end) {
    const middle = Math.floor((start + end) / 2);
    iterations++;

    try {
      const entry = await getEntryAt(middle);

      const comparison = searchTerm.localeCompare(entry.inflected);

      if (comparison === 0) {
        const endTime = performance.now();
        displayResult(entry, iterations, endTime - startTime);
        return;
      } else if (comparison < 0) {
        end = middle - 1;
      } else {
        start = middle + 1;
      }
    } catch (error) {
      console.error(error.message);
      break;
    }
  }

  const endTime = performance.now();
  displayResult(null, iterations, endTime - startTime);
}

function displayResult(entry, iterations, timeTaken) {
  const resultContainer = document.getElementById("result");

  if (entry) {
    resultContainer.innerHTML = `
      <p><strong>Inflected:</strong> ${entry.inflected}</p>
      <p><strong>Headword:</strong> ${entry.headword}</p>
      <p><strong>Homograph:</strong> ${entry.homograph}</p>
      <p><strong>Part of Speech:</strong> ${entry.partofspeech}</p>
      <p><strong>ID:</strong> ${entry.id}</p>
      <p><strong>Iterations:</strong> ${iterations}</p>
      <p><strong>Time Taken:</strong> ${(timeTaken / 1000).toFixed(3)} seconds</p>
    `;
  } else {
    resultContainer.innerHTML = `
      <p><strong>Word not found.</strong></p>
      <p><strong>Iterations:</strong> ${iterations}</p>
      <p><strong>Time Taken:</strong> ${(timeTaken / 1000).toFixed(3)} seconds</p>
    `;
  }
}

document.getElementById("searchButton").addEventListener("click", () => {
  const searchTerm = document.getElementById("searchInput").value.trim();
  if (searchTerm) {
    binarySearch(searchTerm);
  }
});
