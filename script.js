let ingredients = {}; // { 이름: { price: 가격, quantity: 수량 } }
let recipes = {}; // { 요리 이름: [{ ingredient: 재료 이름, quantity: 수량 }] }

// 식재료 추가
document.getElementById('addIngredientBtn').addEventListener('click', function() {
  const ingredient = document.getElementById('ingredient').value;
  const price = parseFloat(document.getElementById('price').value);
  const quantity = parseFloat(document.getElementById('quantity').value);

  if (ingredient && price && quantity) {
    ingredients[ingredient] = { price, quantity };
    updateIngredientList();
    document.getElementById('ingredient').value = '';
    document.getElementById('price').value = '';
    document.getElementById('quantity').value = '';
  } else {
    alert("모든 값을 입력해주세요.");
  }
});

function updateIngredientList() {
  const list = document.getElementById('ingredientList');
  list.innerHTML = '';
  for (let ingredient in ingredients) {
    const li = document.createElement('li');
    li.textContent = `${ingredient} - ${ingredients[ingredient].price}원 - ${ingredients[ingredient].quantity}개`;
    list.appendChild(li);
  }
}

// 재료 추가 버튼 (레시피에)
document.getElementById('addMoreIngredientsBtn').addEventListener('click', function() {
  const div = document.createElement('div');
  div.innerHTML = `
    <input type="text" class="recipeIngredient" placeholder="재료 이름">
    <input type="number" class="recipeQuantity" placeholder="필요한 수량">
  `;
  document.getElementById('recipeIngredients').appendChild(div);
});

// 레시피 추가
document.getElementById('addRecipeBtn').addEventListener('click', function() {
  const recipeName = document.getElementById('recipeName').value;
  const ingredientElements = document.querySelectorAll('.recipeIngredient');
  const quantityElements = document.querySelectorAll('.recipeQuantity');
  
  if (recipeName && ingredientElements.length) {
    recipes[recipeName] = [];
    for (let i = 0; i < ingredientElements.length; i++) {
      const ingredient = ingredientElements[i].value;
      const quantity = parseFloat(quantityElements[i].value);
      if (ingredient && quantity) {
        recipes[recipeName].push({ ingredient, quantity });
      }
    }
    updateRecipeList();
    updateRecipeDropdown();
    document.getElementById('recipeName').value = '';
    document.getElementById('recipeIngredients').innerHTML = `
      <input type="text" class="recipeIngredient" placeholder="재료 이름">
      <input type="number" class="recipeQuantity" placeholder="필요한 수량">
    `;
  } else {
    alert("레시피 이름과 재료를 입력해주세요.");
  }
});

function updateRecipeList() {
  const list = document.getElementById('recipeList');
  list.innerHTML = '';
  for (let recipe in recipes) {
    const li = document.createElement('li');
    li.textContent = `${recipe} - ${JSON.stringify(recipes[recipe])}`;
    list.appendChild(li);
  }
}

function updateRecipeDropdown() {
  const select = document.getElementById('selectRecipe');
  select.innerHTML = '<option value="">요리 선택</option>';
  for (let recipe in recipes) {
    const option = document.createElement('option');
    option.value = recipe;
    option.textContent = recipe;
    select.appendChild(option);
  }
}

// 요리 계산
document.getElementById('calculateBtn').addEventListener('click', function() {
  const recipeName = document.getElementById('selectRecipe').value;
  const recipeCount = parseFloat(document.getElementById('recipeCount').value);

  if (recipeName && recipeCount && recipes[recipeName]) {
    const resultList = document.getElementById('calculationResults');
    resultList.innerHTML = '';
    let totalCost = 0;

    recipes[recipeName].forEach(item => {
      const ingredient = item.ingredient;
      const neededQuantity = item.quantity * recipeCount;

      if (ingredients[ingredient]) {
        const availableQuantity = ingredients[ingredient].quantity;
        if (availableQuantity >= neededQuantity) {
          const cost = neededQuantity * ingredients[ingredient].price;
          totalCost += cost;
          ingredients[ingredient].quantity -= neededQuantity;

          const li = document.createElement('li');
          li.textContent = `${ingredient}: ${neededQuantity} 사용 (남은 수량: ${ingredients[ingredient].quantity})`;
          resultList.appendChild(li);
        } else {
          alert(`${ingredient}의 수량이 부족합니다.`);
        }
      } else {
        alert(`${ingredient}이(가) 없습니다.`);
      }
    });

    const totalLi = document.createElement('li');
    totalLi.textContent = `총 요리 비용: ${totalCost}원`;
    resultList.appendChild(totalLi);
    updateIngredientList();
  } else {
    alert("요리와 개수를 선택해주세요.");
  }
});