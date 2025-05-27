// 圖表全局變量
let priceChart = null;

// 視圖切換功能
function setupViewToggle() {
    const chartViewBtn = document.getElementById('chart-view-btn');
    const tableViewBtn = document.getElementById('table-view-btn');
    const chartContainer = document.getElementById('chart-container');
    const tableContainer = document.getElementById('table-container');

    chartViewBtn.addEventListener('click', () => {
        chartViewBtn.classList.add('active');
        tableViewBtn.classList.remove('active');
        chartContainer.classList.add('active');
        tableContainer.classList.remove('active');
    });

    tableViewBtn.addEventListener('click', () => {
        tableViewBtn.classList.add('active');
        chartViewBtn.classList.remove('active');
        tableContainer.classList.add('active');
        chartContainer.classList.remove('active');
    });
}

// 生成圖表的函數
function renderChart(data) {
    // 按西瓜類型分組數據
    const watermelonTypes = ['西瓜(大粒)', '西瓜(小粒)', '西瓜(無子)'];
    const groupedData = {};

    watermelonTypes.forEach(type => {
        groupedData[type] = {};
    });

    // 將數據按類型和年份進行整理
    data.forEach(item => {
        if (!groupedData[item.name]) return;

        const year = item.date;
        if (year && item.price !== null) {
            groupedData[item.name][year] = item.price;
        }
    });

    // 整理成圖表數據格式
    const years = [...new Set(data.map(item => item.date))].sort();
    const datasets = [];

    // 為每種西瓜建立一個數據集
    const colors = {
        '西瓜(大粒)': 'rgb(255, 99, 132)',
        '西瓜(小粒)': 'rgb(54, 162, 235)',
        '西瓜(無子)': 'rgb(75, 192, 192)'
    };

    watermelonTypes.forEach(type => {
        const typeData = [];
        years.forEach(year => {
            typeData.push(groupedData[type][year] || null);
        });

        datasets.push({
            label: type,
            data: typeData,
            borderColor: colors[type],
            backgroundColor: colors[type],
            tension: 0.1,
            fill: false
        });
    });

    // 銷毀舊圖表（如果存在）
    if (priceChart) {
        priceChart.destroy();
    }

    // 創建新圖表
    const ctx = document.getElementById('priceChart').getContext('2d');
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '2004-2024年西瓜價格趨勢圖'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: '價格 (元/公斤)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: '年份'
                    }
                }
            }
        }
    });
}

window.addEventListener('DOMContentLoaded', async () => {
    // 設置視圖切換功能
    setupViewToggle();

    try {
        const res = await fetch('/api', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        const tbody = document.getElementById('data-table-body');
        tbody.innerHTML = '';
        data.forEach(element => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${element.date || element.year}</td>
                             <td>${element.price}</td>
                             <td>${element.name}</td>`;
            tbody.appendChild(row);
        });

        // 生成初始圖表
        renderChart(data);
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
});

document.getElementById('search-btn').addEventListener('click', async () => {
    const startYear = document.getElementById('start-year').value;
    const endYear = document.getElementById('end-year').value;
    const price = document.getElementById('price').value;
    const type = document.getElementById('type-selector').value;

    // Build query params
    const params = new URLSearchParams();
    if (startYear) params.append('startYear', startYear);
    if (endYear) params.append('endYear', endYear);
    if (price) params.append('price', price);
    if (type) params.append('type', type);

    try {
        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();
        const tbody = document.getElementById('data-table-body');
        tbody.innerHTML = '';
        data.forEach(element => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${element.date || element.year}</td>
                             <td>${element.price}</td>
                             <td>${element.name}</td>`;
            tbody.appendChild(row);
        });

        // 使用查詢結果更新圖表
        renderChart(data);
    } catch (error) {
        console.error('Failed to fetch search data:', error);
    }
});
