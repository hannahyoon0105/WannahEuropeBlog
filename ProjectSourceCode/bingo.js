document.addEventListener('DOMContentLoaded', () => {
    const letters = ['B', 'I', 'N', 'G', 'O'];

    // Fetch the bingo data
    fetch('init_data/bingo.json')
        .then(response => response.json())
        .then(bingoData => {
            const bingoBoard = document.getElementById('bingoBoard');
            
            // Populate bingo board
            bingoData.forEach((item, index) => {
                const cell = document.createElement('div');
                cell.classList.add('bingo-cell');
                cell.innerText = item.text;
                if (item.completed) {
                    cell.classList.add('completed');
                }

                cell.addEventListener('click', () => {
                    fetch(`/update-bingo/${index}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ completed: !item.completed })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            item.completed = !item.completed;
                            cell.classList.toggle('completed');
                        }
                    });
                });

                bingoBoard.appendChild(cell);
            });
        });
});