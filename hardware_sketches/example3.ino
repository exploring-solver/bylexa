#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "your_SSID";
const char* password = "your_PASSWORD";
const char* serverUrl = "http://your-backend-url/api/projects/YOUR_PROJECT_ID/current-command";  // Replace with your API URL

int ledPin = 2;  // GPIO pin for LED

void setup() {
  Serial.begin(115200);

  // Initialize the LED pin
  pinMode(ledPin, OUTPUT);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to Wi-Fi...");
  }

  Serial.println("Connected to Wi-Fi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    http.begin(serverUrl);  // Specify the API endpoint
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      String payload = http.getString();
      Serial.println("Received payload: " + payload);

      // Parse the JSON response
      StaticJsonDocument<200> doc;
      DeserializationError error = deserializeJson(doc, payload);

      if (!error) {
        String command = doc["command"];  // Assuming the API returns a field called "command"
        Serial.println("Command received: " + command);

        // Execute actions based on the command
        if (command == "turn_on_led") {
          digitalWrite(ledPin, HIGH);  // Turn on LED
          Serial.println("LED turned on");
        } else if (command == "turn_off_led") {
          digitalWrite(ledPin, LOW);   // Turn off LED
          Serial.println("LED turned off");
        } else {
          Serial.println("Unknown command: " + command);
        }
      } else {
        Serial.println("Error parsing JSON");
      }
    } else {
      Serial.println("Error in HTTP request: " + String(httpResponseCode));
    }

    http.end();  // Close the connection
  }

  delay(10000);  // Wait for 10 seconds before making another request
}
