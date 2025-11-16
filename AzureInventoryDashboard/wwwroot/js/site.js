// Azure Inventory Dashboard - Client Side JavaScript

// Chart.js default configuration for dark theme
if (typeof Chart !== 'undefined') {
    Chart.defaults.color = '#c9d1d9';
    Chart.defaults.borderColor = '#30363d';
    Chart.defaults.backgroundColor = 'rgba(88, 166, 255, 0.2)';
}

// Sync customer resources
async function syncCustomerResources(customerId, customerName) {
    const btn = event.target;
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Syncing...';

    try {
        const response = await fetch(`/Customer/SyncResources?id=${customerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (result.success) {
            showAlert(`Successfully synced ${result.resourceCount} resources for ${customerName}`, 'success');
            setTimeout(() => location.reload(), 2000);
        } else {
            showAlert(`Error: ${result.message}`, 'danger');
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    } catch (error) {
        showAlert(`Error syncing resources: ${error.message}`, 'danger');
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    const container = document.querySelector('.container') || document.body;
    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = alertHtml;
    container.insertBefore(alertDiv.firstElementChild, container.firstChild);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
        const alert = container.querySelector('.alert');
        if (alert) {
            alert.remove();
        }
    }, 5000);
}

// Delete confirmation
function confirmDelete(message) {
    return confirm(message || 'Are you sure you want to delete this item?');
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
}

// Initialize tooltips (if Bootstrap is loaded)
document.addEventListener('DOMContentLoaded', function() {
    // Update relative dates
    document.querySelectorAll('[data-date]').forEach(el => {
        const date = el.getAttribute('data-date');
        el.textContent = formatDate(date);
    });

    // Auto-dismiss alerts
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });
});

// Resource chart initialization
function initializeResourceChart(canvasId, customerId) {
    fetch(`/Inventory/GetResourceChartData?customerId=${customerId}`)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById(canvasId);
            if (!ctx) return;

            const labels = data.map(item => item.type.split('/').pop());
            const counts = data.map(item => item.count);

            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Resource Count',
                        data: counts,
                        backgroundColor: [
                            'rgba(88, 166, 255, 0.8)',
                            'rgba(63, 185, 80, 0.8)',
                            'rgba(255, 123, 114, 0.8)',
                            'rgba(210, 153, 34, 0.8)',
                            'rgba(163, 113, 247, 0.8)',
                            'rgba(255, 179, 64, 0.8)',
                            'rgba(54, 162, 235, 0.8)',
                            'rgba(255, 99, 132, 0.8)',
                            'rgba(75, 192, 192, 0.8)',
                            'rgba(153, 102, 255, 0.8)'
                        ],
                        borderColor: '#161b22',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                color: '#c9d1d9',
                                padding: 15,
                                font: {
                                    size: 12
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Resources by Type',
                            color: '#c9d1d9',
                            font: {
                                size: 16,
                                weight: 'bold'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error loading chart data:', error));
}

// Initialize metrics chart
function initializeMetricsChart(canvasId, metricData) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    const labels = metricData.values.map(v => new Date(v.timestamp).toLocaleString());
    const averages = metricData.values.map(v => v.average);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: metricData.metricName,
                data: averages,
                borderColor: 'rgba(88, 166, 255, 1)',
                backgroundColor: 'rgba(88, 166, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#c9d1d9'
                    }
                },
                title: {
                    display: true,
                    text: `${metricData.metricName} (${metricData.unit})`,
                    color: '#c9d1d9',
                    font: {
                        size: 14,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#c9d1d9'
                    },
                    grid: {
                        color: '#30363d'
                    }
                },
                x: {
                    ticks: {
                        color: '#c9d1d9',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        color: '#30363d'
                    }
                }
            }
        }
    });
}
