#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

function parseCsvToAuthoringV2(csvText) {
  const lines = csvText.trim().split('\n');
  const errors = [];
  const out = [];
  if (lines.length < 1) {
    throw new Error('Le fichier est vide');
  }
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    const parts = line.split(/(?=\S),(?=\S)/).map(part => part.trim());
    if (parts.length < 4) {
      errors.push(`Ligne ${index + 1}: Pas assez de colonnes (minimum: question, une option, réponses, url_image)`);
      return;
    }
    const question = parts[0];
    const correctAnswersStr = parts[parts.length - 2];
    let imageUrl = parts[parts.length - 1] || null;
    if (imageUrl === 'none') imageUrl = null;
    const options = parts.slice(1, -2);
    const correctAnswers = correctAnswersStr
      .split(/(?<!\\);/)
      .map(ans => ans.replace(/\\;/g, ';').trim())
      .filter(Boolean);
    const responses = options.map(opt => ({ text: opt, isCorrect: correctAnswers.includes(opt) }));
    out.push({ question, responses, imageUrl });
  });
  if (errors.length > 0) {
    throw new Error('Erreurs de format détectées:\n' + errors.join('\n'));
  }
  return out;
}

function main() {
  const [,, inputPath, outputPath] = process.argv;
  if (!inputPath) {
    console.error('Usage: node scripts/convertCsvToJson.mjs <input.csv> [output.json]');
    process.exit(1);
  }
  const csvText = fs.readFileSync(inputPath, 'utf8');
  const data = parseCsvToAuthoringV2(csvText);
  const json = JSON.stringify(data, null, 2);
  if (outputPath) {
    fs.writeFileSync(outputPath, json, 'utf8');
    console.log(`Écrit: ${outputPath}`);
  } else {
    const out = path.format({ ...path.parse(inputPath), base: undefined, ext: '.json' });
    fs.writeFileSync(out, json, 'utf8');
    console.log(`Écrit: ${out}`);
  }
}

main();


