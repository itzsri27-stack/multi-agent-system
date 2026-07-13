## Multi-Agent System (Wiki + Weather)

## Overview :
This project is a Python-based Multi-Agent System that demonstrates how multiple intelligent agents 
can work together to answer different types of user queries. A central Controller Agent analyzes the user's request 
and routes it to the appropriate specialized agent.

## Features :
- 📚 Wikipedia Agent – Retrieves concise summaries from Wikipedia.
- 🌤️ Weather Agent – Fetches live weather information using the OpenWeatherMap API.
- 🧠 Controller Agent – Determines which agent should handle the user's query.
- ⚡ Simple and modular architecture for handling multiple tasks.

## Technologies Used
- Python
- Jupyter Notebook / Google Colab
- Wikipedia API
- OpenWeatherMap API

## Project Structure
```
Project3_MultiAgentSystem/
├── infobot.ipynb
└── README.md
```

## How to Run
1. Open `infobot.ipynb` in Google Colab or Jupyter Notebook.
2. Replace `"YOUR_API_KEY_HERE"` with your OpenWeatherMap API key.
3. Run all the notebook cells.
4. Enter a query and let the controller choose the appropriate agent.

## Sample Queries
- Weather in Coimbatore
- Weather in Chennai
- Who is Elon Musk?
- Who is Thalapathy Vijay?

## Future Improvements
- Add support for more specialized agents.
- Improve query classification.
- Develop a web interface using Flask or Streamlit.
- Integrate additional APIs for richer responses.

## Author
Yuvasri
