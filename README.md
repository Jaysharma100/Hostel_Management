# Hostel_Management

<img width="5664" alt="Hostel Management App (HMA)" src="https://github.com/user-attachments/assets/ba01c56f-d3cc-43a7-84b8-a43ae133af36" />
Function & flow of HMA( Hostel Management App)

### 🔄 Performance Benchmark: Redis vs. MongoDB (Room Locking Logic)

To handle real-time room booking and prevent race conditions, we tested the response times of **Redis** and **MongoDB** while updating a room lock flag.

#### 1) MongoDB Lock Write Times (ms)
`380`, `285`, `407`, `389`, `378`, `360`, `305`, `391`, `333`, `387`, `520`  
- 🔼 **Highest:** 520 ms  
- 🔽 **Lowest:** 285 ms  
- 📊 **Average:** 375.91 ms (11 tests)

#### 2) Redis Lock Write Times (ms)
`161`, `181`, `157`, `159`, `161`, `141`, `190`, `201`, `149`, `130`, `146`  
- 🔼 **Highest:** 201 ms  
- 🔽 **Lowest:** 130 ms  
- 📊 **Average:** 161.45 ms (11 tests)

#### Result:
On average, **Redis performed 2.33× faster than MongoDB** for room-lock updates.  
This optimization significantly improved booking response times and ensured real-time consistency during concurrent room access scenarios.
