#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Servo.h>

const char* ssid = "your_SSID";
const char* password = "your_PASSWORD";
const char* serverUrl = "http://your-backend-url/api/projects/YOUR_PROJECT_ID/current-command";  // Replace with your API URL

Servo myServo;  // Create a servo object
int servoPin = 13;  // GPIO pin for the servo

void setup() {
  Serial.begin(115200);

  // Attach the servo to the pin
  myServo.attach(servoPin);

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
        if (command == "move_servo_90") {
          myServo.write(90);  // Move servo to 90 degrees
          Serial.println("Servo moved to 90 degrees");
        } else if (command == "move_servo_0") {
          myServo.write(0);   // Move servo to 0 degrees
          Serial.println("Servo moved to 0 degrees");
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
