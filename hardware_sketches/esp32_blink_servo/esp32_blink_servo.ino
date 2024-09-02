#include <WiFi.h>
#include <HTTPClient.h>
#include <ESP32Servo.h>  // Use ESP32Servo library instead of the standard Servo library
#include <config.h>
// Replace with your network credentials
const char* ssid = SSID;
const char* password = PASSWORD;
const char* serverName = SERVER_NAME;

Servo myServo;
const int ledPin = 2;
const int servoPin = 13;

void setup() {
  Serial.begin(115200);
  
  myServo.attach(servoPin);
  pinMode(ledPin, OUTPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    
    int httpResponseCode = http.GET();
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Received command: " + response);
      
      if (response == "blink_led") {
        blinkLED();
      } else if (response == "rotate_servo") {
        rotateServo();
      }
    } else {
      Serial.println("Error on HTTP request");
    }
    
    http.end();
  }
  
  delay(5000);
}

void blinkLED() {
  digitalWrite(ledPin, HIGH);
  delay(1000);
  digitalWrite(ledPin, LOW);
  delay(1000);
}

void rotateServo() {
  for (int pos = 0; pos <= 180; pos += 1) {
    myServo.write(pos);
    delay(15);
  }
  for (int pos = 180; pos >= 0; pos -= 1) {
    myServo.write(pos);
    delay(15);
  }
}