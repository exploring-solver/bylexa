#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "your_SSID";
const char* password = "your_PASSWORD";
const char* serverUrl = "http://your-backend-url/api/projects/YOUR_PROJECT_ID/current-command";  // Replace with your API URL

void setup() {
  Serial.begin(115200);

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

      // Parsing the JSON response
      StaticJsonDocument<200> doc;
      DeserializationError error = deserializeJson(doc, payload);

      if (!error) {
        String command = doc["command"];  // Assuming "command" field exists in the response
        Serial.println("Command received: " + command);

        // You can execute actions based on the command here
        if (command == "turn_on_led") {
          digitalWrite(LED_BUILTIN, HIGH);  // Example: Turn on LED
        } else if (command == "turn_off_led") {
          digitalWrite(LED_BUILTIN, LOW);   // Example: Turn off LED
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
