const inputTask = document.querySelector('.task-manager__input');
const createTaskBtn = document.querySelector('.task-manager__btn-create');

const wrapperTask = document.querySelector('.task-manager__items');

let cnt = 1;
const createTask = () => {
        if(inputTask.value){
        wrapperTask.innerHTML += ` <div class="tasks__wrapper">
                <label for="${cnt}" class="tasks__item">
                    ${inputTask.value}
                </label>
                <input type="checkbox" name="task" id="${cnt}">
                <button type="button" class="tasks__edit">
                    <img src="./assets/img/edit.png" />
                </button>
                <button class="tasks__btn-delete">
                    Удалить
                </button>
            </div>`;
            inputTask.value = '';
            cnt++;
        } 
}

const allDelete = () => {
    const itemsTask = document.querySelectorAll('.tasks__wrapper');
    itemsTask.forEach(item => item.remove())
}



/*добавить функционал сохранения задач в localStorage. 
// Это значит что после создания задач, пользователь может перезагрузить 
страницу и не потерять даннх. */

/* добавить выбор даты (у каждой даты свой набор задач). 
Должно работать в связке с localStorage.*/


document.addEventListener('DOMContentLoaded', () => {
    // create task button click
    createTaskBtn.addEventListener('click', () => {
        createTask();
    })
    // create task - key - enter
    inputTask.addEventListener('keydown', (e) => {
        if(e.key === 'Enter'){
            createTask();
        }
    });
    // all delete
    document.addEventListener('click', (e) => {
        if(e.target.closest('.task-manager__update')){
            allDelete()
        }
    })
    // Delete task
    document.addEventListener('click', (e) => {
        if(e.target.closest('.tasks__btn-delete')){
            e.target.parentNode.remove()
        }
    });
    // Task completed
    document.addEventListener('change', (e) => {
        if(e.target.closest('.tasks__wrapper input')){
            const textTask = e.target.previousElementSibling;
            if(textTask && textTask.classList.contains('tasks__item')){
                textTask.classList.toggle('toggle');
            }
        }
    });
    // Edit Task
    document.addEventListener('click', (e) => {
        if(e.target.closest('.tasks__edit')){
           const itemTask = e.target.parentNode;

           e.target.previousElementSibling.disabled = true;
           itemTask.firstElementChild.innerHTML = `
        <div class="tasks__edit-wrapper">
            <input type="text" class="task__edit-input"/>
            <button type="button">Сохранить</button>
        </div>`;

        };

        // Save new text
        document.addEventListener('click', (e) => {
            if(e.target.closest('.tasks__edit-wrapper button')){
                const newText = e.target.previousElementSibling.value;
                const item = e.target.parentNode.parentNode;

                const checkbox = item?.nextElementSibling;
                
                if(item && item.classList.contains('tasks__item')){
                    item.innerHTML = `${newText}`;
                    item.classList.toggle('toggle');
                }
                if(checkbox){
                    checkbox.disabled = false;
                    checkbox.checked = true;
                }
     
            }
        })
    })
})