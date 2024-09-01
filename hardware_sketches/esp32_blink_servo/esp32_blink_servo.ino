#include <WiFi.h>
#include <HTTPClient.h>
#include <ESP32Servo.h>  // Use ESP32Servo library instead of the standard Servo library
#include <config.h>
// Replace with your network credentials
const char* ssid = SSID;
const char* password = PASSWORD;

const char* serverName = SERVER_NAME;

Servo myServo;  // create servo object to control a servo
int ledPin = 2; // GPIO pin for LED
int servoPin = 13; // GPIO pin for Servo (PWM-capable)

void setup() {
  Serial.begin(115200);

  // Attach the servo to GPIO 13 (PWM pin)
  myServo.attach(servoPin);

  pinMode(ledPin, OUTPUT);  // set LED pin as output

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("Connected to WiFi");
}

void loop() {
  if ((WiFi.status() == WL_CONNECTED)) { // Check Wi-Fi connection
    HTTPClient http;
    http.begin(serverName);  // Connect to Node.js server to get command

    // Send HTTP request to Node.js server to get command
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println("Received command: " + response);

      // Execute the command based on the response
      if (response == "blink_led") {
        Serial.println("Executing blink_led command...");
        digitalWrite(ledPin, HIGH);
        delay(1000);
        digitalWrite(ledPin, LOW);
        delay(1000);
      } else if (response == "rotate_servo") {
        Serial.println("Executing rotate_servo command...");
        
        // Sweep the servo motor from 0 to 180 degrees and back
        for (int pos = 0; pos <= 180; pos++) {
          myServo.write(pos);
          delay(15);
        }
        for (int pos = 180; pos >= 0; pos--) {
          myServo.write(pos);
          delay(15);
        }
      }
    } else {
      Serial.println("Error on HTTP request");
    }

    http.end();  // End the HTTP connection
  }
  
  delay(5000);  // Interval between checks
}
