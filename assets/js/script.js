const inputTask = document.querySelector('.task-manager__input');
const createTaskBtn = document.querySelector('.task-manager__btn-create');

const wrapperTask = document.querySelector('.task-manager__items');


const tasksItem = (cnt, text, label) => {
    return ` <div class="tasks__wrapper">
                <label for="${cnt}" class="${!label ? "tasks__item" : "tasks__item toggle"}">
                    ${text}
                </label>
                <input type="checkbox" name="task" id="${cnt}" ${label && 'checked'}>
                <button type="button" class="tasks__edit">
                    <img src="./assets/img/edit.png" />
                </button>
                <button class="tasks__btn-delete">
                    Удалить
                </button>
            </div>`;
}

const getTask = () => {
    const dataLocal = localStorage.getItem('tasks') || "[]";
    return JSON.parse(dataLocal);
}


const setTask = (tasks) => {
    const taskJson = JSON.stringify(tasks);
    localStorage.setItem('tasks', taskJson);
}


let taskStorage = getTask();


const updateLocal = (edit = false, newText, idItem) => {
    taskStorage.forEach(el => {
        if(newText !== null && el.id == idItem && el.text !== newText){
            el.text = newText
        }
        if(el.id == idItem && el.flag !== edit){
            el.flag = edit
        }
    })
    setTask(taskStorage);
}

const now = new Date();
const dateInput = document.querySelector('.date');


const tasksLocal = () => {
    const isDayArr = taskStorage.filter(({date}) => date === dateInput.value);
    wrapperTask.innerHTML = '';

    if(!isDayArr.length){
        wrapperTask.innerHTML = "<h2>Список задач пуст</h2>";
    } 

    isDayArr.forEach(({id, text, flag} )=> {
        wrapperTask.innerHTML += tasksItem(id, text, flag);
    })
}

const createTask = () => {
        if(inputTask.value){
            taskStorage.push({
                text: inputTask.value,
                flag: false,
                id: Date.now(),
                date: dateInput.value
        });
        wrapperTask.firstElementChild.tagName === 'H2' && wrapperTask.firstElementChild.remove();
        tasksLocal()
        inputTask.value = '';
        setTask(taskStorage);
        }
}



const allDelete = () => {
    const itemsTask = document.querySelectorAll('.tasks__wrapper');
    itemsTask.forEach(item => item.remove())
    localStorage.clear('tasks');
}


document.addEventListener('DOMContentLoaded', () => {
    // Output input date 
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const fullDate = year + "-" + month + "-" + day ;
    dateInput.value = fullDate;

    // create task button click
    createTaskBtn.addEventListener('click', () => {
        createTask();
    });
    // create task - key - enter
    inputTask.addEventListener('keydown', (e) => {
        if(e.key === 'Enter'){
            createTask();
        }
    });
    // all delete
    document.addEventListener('click', (e) => {
        if(e.target.closest('.task-manager__update')){
            allDelete();
        }
    });
    // Delete task
    document.addEventListener('click', (e) => {
        if(e.target.closest('.tasks__btn-delete')){
            const clickInd = e.target.parentNode.firstElementChild.getAttribute('for');
            const storageFilter = taskStorage.filter((el) => clickInd != el.id);
            taskStorage = [...storageFilter];
            e.target.parentNode.remove();
            setTask(storageFilter);
        }
    });
    // Task completed
    document.addEventListener('change', (e) => {
        if(e.target.closest('.tasks__wrapper input')){
            const textTask = e.target.previousElementSibling;
            updateLocal(e.target.checked, null, e.target.id);
            if(textTask?.classList.contains('tasks__item')){
                textTask.classList.toggle('toggle');
            }
        }
    });
    // Edit Task
    document.addEventListener('click', (e) => {
        if(e.target.closest('.tasks__edit')){
           const itemTask = e.target.parentNode;
           if(!e.target.classList.contains('active')){
            e.target.classList.add('active');
           }

           if(itemTask.firstElementChild.classList.contains('toggle')){
            itemTask.firstElementChild.classList.remove('toggle');
            itemTask.firstElementChild.classList.add('active');
           }

           const initialText = itemTask.firstElementChild.textContent.trim();
           e.target.previousElementSibling.disabled = true;
       
           itemTask.firstElementChild.innerHTML = `
                <div class="tasks__edit-wrapper">
                    <input type="text" value="${initialText}" class="task__edit-input"/>
                    <button type="button">Сохранить</button>
                </div>`;
                };

        // Save new text
        document.addEventListener('click', (e) => {
            if(e.target.closest('.tasks__edit-wrapper button')){
                const newText = e.target.previousElementSibling.value;
                const item = e.target.parentNode.parentNode;
                const editBtn = item?.nextElementSibling.nextElementSibling;
                const checkbox = item?.nextElementSibling;
                if(newText !== ''){
                    if(item?.classList.contains('tasks__item')){
                        item.innerHTML = `${newText}`;
                        item.classList.toggle('toggle');
                        editBtn.classList.remove('active');
                    }
                   
                    if(checkbox){
                        checkbox.disabled = false;
                        checkbox.checked = true;
                    }
                    if(item?.classList.contains('active')){
                        item.classList.toggle('toggle');
                        checkbox.checked = false;
                    }
                    updateLocal(false, newText, item?.getAttribute('for'));
                }
            }
        })
    });
    // Change date
    document.addEventListener('change', (e) => {
        if(inputTask.value === '' && e.target.closest('.date')){
            const arrDays = taskStorage.filter(({date}) => date === dateInput.value);
            wrapperTask.innerHTML = '';
            arrDays.forEach(({id, text, flag} )=> {
            wrapperTask.innerHTML += tasksItem(id, text, flag);
        });
 
        if(!arrDays.length){
            wrapperTask.innerHTML = "<h2>Список задач пуст</h2>"
        } 
        }
    })
    if(taskStorage){
        tasksLocal();
    }
})