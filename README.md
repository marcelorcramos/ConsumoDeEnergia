# README for Energy Consumption Monitoring System

## Overview

This Energy Consumption Monitoring System is a web application designed to help users track, analyze, and optimize their energy consumption. The application provides real-time data visualization, weather impact analysis, and personalized recommendations to reduce energy usage and costs.

## Features

- **Dashboard Overview**: View your current energy consumption, costs, and usage patterns at a glance
- **Consumption Tracking**: Monitor energy usage across different time periods (daily, weekly, monthly, yearly)
- **Device Management**: Track individual device consumption and identify energy-hungry appliances
- **Weather Impact Analysis**: See how weather conditions affect your energy consumption with real-time weather data
- **Energy-Saving Tips**: Get personalized recommendations based on your usage patterns and local weather
- **Reports & Exports**: Generate detailed reports and export data for further analysis
- **Responsive Design**: Access the application from any device with a fully responsive interface

## Technologies Used

- HTML5, CSS3, and JavaScript
- Chart.js for data visualization
- OpenWeatherMap API for weather data
- FontAwesome for icons
- Responsive design with CSS Grid and Flexbox

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/energy-consumption-monitor.git
cd energy-consumption-monitor
```

2. Open `index.html` in your browser to start using the application.

3. For the weather functionality to work properly, ensure you have an internet connection as it uses the OpenWeatherMap API.

## Usage

### Dashboard

The main dashboard displays your current energy consumption, cost estimates, and usage distribution. You can switch between different time periods using the selector at the top.

### Weather Impact

The weather impact section shows how local weather conditions affect your energy consumption. It provides:
- Current weather conditions
- Forecast for upcoming days
- Estimated impact on energy consumption
- Personalized recommendations based on weather

### Device Management

Add and manage your devices to track individual consumption:
1. Click "Add Device" to register a new appliance
2. Enter device details including power rating and usage hours
3. View the impact of each device on your total consumption

### Reports

Generate detailed reports of your energy usage:
1. Select the desired time period
2. Click "Generate Report" to create a printable report
3. Use "Export Data" to download your consumption data in CSV format

## Customization

You can customize the application by:
- Adjusting the electricity cost in the settings
- Adding or removing device categories
- Modifying the consumption calculation parameters

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenWeatherMap for providing weather data
- Chart.js for the visualization library
- FontAwesome for the icon set
