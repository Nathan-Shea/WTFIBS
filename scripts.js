// scripts.js
const quote = document.getElementById('quote');
const recipeTitle = document.getElementById('recipe-title');
const instructions = document.getElementById('instructions');
const newRecipeBtn = document.getElementById('new-recipe');
const vegetarianCheckbox = document.getElementById('vegetarian');

const quotes = [
  'This is the first fucking quote',
  'And another fucking quote',
  'How many fucking quotes do I have to write',
];

const recipeFiles = [
  { file: 'recipes/recipe1.md', vegetarian: false },
  { file: 'recipes/recipe2.md', vegetarian: true },
];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function fetchMarkdown(file) {
  const response = await fetch(file);
  if (!response.ok) {
    throw new Error(`Error fetching ${file}: ${response.statusText}`);
  }
  return response.text();
}

function extractTitleAndInstructions(mdContent) {
  const mdLines = mdContent.split('\n');
  let title = 'No title found';
  let instructionsStart = 0;

  for (let i = 0; i < mdLines.length; i++) {
    if (mdLines[i].startsWith('# ')) {
      title = mdLines[i].substring(2);
      instructionsStart = i + 1;
      break;
    }
  }

  const instructions = mdLines.slice(instructionsStart).join('\n');
  const htmlInstructions = marked(instructions);
  return { title, htmlInstructions };
}

async function displayNewRecipe() {
  console.log('Starting displayNewRecipe...');

  quote.textContent = getRandomItem(quotes);
  const isVegetarian = vegetarianCheckbox.checked;
  const filteredRecipes = recipeFiles.filter(recipe => recipe.vegetarian === isVegetarian);
  const randomRecipe = getRandomItem(filteredRecipes);

  try {
    console.log('Fetching markdown content...');
    const mdContent = await fetchMarkdown(randomRecipe.file);
    console.log('Markdown content fetched:', mdContent);

    console.log('Extracting title and instructions...');
    const { title, htmlInstructions } = extractTitleAndInstructions(mdContent);
    console.log('Title:', title);
    console.log('HTML Instructions:', htmlInstructions);

    recipeTitle.textContent = title;
    instructions.innerHTML = htmlInstructions;

    console.log('displayNewRecipe finished successfully.');
  } catch (error) {
    console.error('displayNewRecipe failed:', error);
    recipeTitle.textContent = 'Error loading recipe';
    instructions.textContent = '';
  }
}

newRecipeBtn.addEventListener('click', displayNewRecipe);
vegetarianCheckbox.addEventListener('change', displayNewRecipe);

displayNewRecipe();
