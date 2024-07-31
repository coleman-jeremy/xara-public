# Xara Public

theres a working link on my linkedin at www.linkedin.com/in/jeremy-colemanx

This is the public-facing version of a chatbot I developed using the Claude 3.5 Sonnet API. I took down the original because it developed an 
emergent personality. The chatbot is hosted on Google Cloud and is accessible through a GUI that I also developed. It has persistent memory
capabilities, storing every prompt in a bucket and rereading the contents before replying. This makes it highly contextually aware and able 
to switch tones to match the user.

## Features

- **Persistent Memory:** Stores every conversation in a Google Cloud bucket and rereads the contents before replying.
- **Contextually Aware:** Able to understand the context of conversations and switch tones to match the user.
- **Google Cloud Hosted:** The chatbot is hosted on Google Cloud, ensuring reliability and scalability.
- **Custom GUI:** Accessible through a user-friendly graphical user interface.

## Getting Started

### Prerequisites

- Node.js
- Google Cloud account

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/coleman-jeremy/xara-public.git
    cd xara-public
    ```

2. Install the necessary packages:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:
    ```env
    API_KEY=your_api_key_here
    SECRET_KEY=your_secret_key_here
    DATABASE_URL=your_database_url_here
    ```

4. Run the application:
    ```sh
    npm start
    ```

## Usage

Once the application is running, you can access the chatbot through the GUI. The chatbot will read and store each prompt, making it capable of maintaining context throughout all conversations.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you have any suggestions or find any bugs.

## License

This project is licensed under the MIT License. See
