let update = false;
let currentIndex = null;
let balance = 0;
let incomeValue = 0;
let expenseValue = 0;
let originalIndex = null;
let reset = document.getElementById("reset");
reset.addEventListener("click", fnReset);
let all = document.getElementById("all");
all.addEventListener("click", getData);
let income = document.getElementById("income");
income.addEventListener("click", incomeData);
let expense = document.getElementById("expense");
expense.addEventListener("click", expenseData);

async function postData() {
  try {

    let description = document.getElementById("description").value;
    let amount = document.getElementById("amount").value;
    let type = document.getElementById("type").value;
    if (update===false) {
      let entries = JSON.parse(localStorage.getItem('dataEntries')) || []; //JSON parse to convert string as array[object object]
      entries.push({
        description,
        amount,
        type
      });
      await localStorage.setItem("dataEntries", JSON.stringify(entries)); //json stringify gives['a':'a']

      calculation();
      getData();
      document.getElementById("all").checked = true;
      console.log("data Posted Successfully");

      document.getElementById("description").value = '';
      document.getElementById("amount").value = '';
      document.getElementById("Income").value = 'Income';

    } else {
      let entries = JSON.parse(localStorage.getItem('dataEntries')) || [];
      entries[currentIndex] = {
        description,
        amount,
        type,
      };
     
      await localStorage.setItem("dataEntries", JSON.stringify(entries)); //json stringify gives['a':'a']
      getData();
      calculation();
      document.getElementById("all").checked = true;

      console.log("data updated Successfully");
      document.getElementById("description").value = '';
      document.getElementById("amount").value = '';
      document.getElementById("Income").value = 'Income';

      update = false;
      currentIndex = null;
    }

  } catch (error) {
    console.log("something went wrong in postdata" + error);
  }
}


async function getData() {
  try {
    let entriesList = JSON.parse(localStorage.getItem('dataEntries')) || [];
    let container = document.getElementById("container");
    container.innerHTML = '';
    entriesList.forEach((entry, index) => {
      container.innerHTML +=
        `<div class="w-full m-4 shadow-md border-2 border-gray-100 p-4  grid grid-cols-1 text-center sm:grid-cols-3">
<div class="text-lg font-bold ">${entry.description}-${entry.amount}</div>
<div class="text-center text-lg  ">${entry.type}</div>
<div class="space-x-2 mx-auto">
<button type="button" class="px-2 py-2 rounded-lg bg-blue-800 text-white hover:bg-blue-900" onclick="putData(${index})">Edit</button>
<button type="button" class="px-2 py-2 rounded-lg bg-red-600 text-white hover:bg-red-800" onclick="deleteData(${index})">Delete</button>
</div>
</div>`;
    });


    console.log("data displayed Successfully" + entriesList);
  } catch (error) {
    console.log("something went wrong in getdata" + error);
  }
}

async function putData(index) {
  try {
    let entriesList = JSON.parse(localStorage.getItem('dataEntries'));
    let entry = entriesList[index];
    document.getElementById("description").value = entry.description;
    document.getElementById("amount").value = entry.amount;
    document.getElementById("type").value = entry.type;
    addEntry = document.getElementById("addEntry");
    addEntry.innerHTML = "Update";
    update = true;
    currentIndex = index;
  } catch (error) {
    console.log("something went wrong in putData" + error);
  }
}
async function deleteData(index) {
  try {
    let entriesList = JSON.parse(localStorage.getItem('dataEntries'));
    await entriesList.splice(index, 1); //splice(which element,how many elemts)
    localStorage.setItem('dataEntries', JSON.stringify(entriesList));
    getData();
    calculation();
    console.log("Data deleted successfully");
  } catch (error) {
    console.log("something went wrong in putData" + error);
  }
}

async function calculation() {
  let entriesList = JSON.parse(localStorage.getItem('dataEntries'));
  let incomeValue = entriesList.filter((entry) => entry.type === "Income").reduce((acc, curr) => acc = acc + Number(curr.amount), 0);
  let expenseValue = entriesList.filter((entry) => entry.type === "Expense").reduce((acc, curr) => acc = acc + Number(curr.amount), 0);
  balance = incomeValue - expenseValue;
  document.getElementById("incomeValue").innerHTML = `$${incomeValue}`;
  document.getElementById("expenseValue").innerHTML = `$${expenseValue}`;
  document.getElementById("balanceValue").innerHTML = `$${balance}`;
}

async function fnReset() {

  document.getElementById("description").value = '';
  document.getElementById("amount").value = '';
  document.getElementById("type").value = '';

}
async function incomeData() {
  try {
    let entriesList = JSON.parse(localStorage.getItem('dataEntries')) || [];
    let container = document.getElementById("container");
    container.innerHTML = '';
    entriesList.map((entry, index) => ({
      ...entry,
      originalIndex: index
    })).filter((entry) => entry.type === "Income").forEach((entry) => {
      container.innerHTML +=
        `<div class="w-full m-4 shadow-md border-2 border-gray-100 p-4 grid grid-cols-1 md:grid grid-cols-4 mx-auto">
<div class="text-lg font-bold">${entry.description}-${entry.amount}</div>
<div class="grid col-span-2 text-center">${entry.type}</div>
<div class="space-x-2">
<button type="button" class="px-2 py-2 rounded-lg bg-blue-800 text-white hover:bg-blue-900" onclick='putData(${entry.originalIndex})'>Edit</button>
<button type="button" class="px-2 py-2 rounded-lg bg-red-600 text-white hover:bg-red-800" onclick="deleteData(${entry.originalIndex})">Delete</button>
</div>
</div>`;
    });


    console.log("data displayed Successfully" + entriesList);
  } catch (error) {
    console.log("something went wrong in getdata" + error);
  }
}
async function expenseData() {
  try {
    let entriesList = JSON.parse(localStorage.getItem('dataEntries')) || [];
    let container = document.getElementById("container");
    container.innerHTML = '';
    entriesList.map((entry, index) => ({
      ...entry,
      originalIndex: index
    })).filter((entry) => entry.type === "Expense").forEach((entry) => {
      container.innerHTML +=
        `<div class="w-full m-4 shadow-md border-2 border-gray-100 p-4 grid grid-cols-1 md:grid grid-cols-4 mx-auto">
<div class="text-lg font-bold">${entry.description}-${entry.amount}</div>
<div class="grid col-span-2 text-center">${entry.type}</div>
<div class="space-x-2">
<button type="button" class="px-2 py-2 rounded-lg bg-blue-800 text-white hover:bg-blue-900" onclick='putData(${entry.originalIndex})'>Edit</button>
<button type="button" class="px-2 py-2 rounded-lg bg-red-600 text-white hover:bg-red-800" onclick="deleteData(${entry.originalIndex})">Delete</button>
</div>
</div>`;
    });


    console.log("data displayed Successfully" + entriesList);
  } catch (error) {
    console.log("something went wrong in getdata" + error);
  }
}

getData();

calculation();
// localStorage.clear();