# System Telemetry API Specification

This document outlines the API endpoints needed to support the System Telemetry dashboard. The frontend currently uses mock data structured as defined below.

## Base URL

```
/admin/telemetry
```

---

## 1. System-Wide Summary (Super Admin)

### Endpoint

```
GET /admin/telemetry/system-summary
```

### Description

Returns comprehensive system-wide statistics for super admin users. This endpoint provides high-level metrics across all schools, customers, students, RFID tags, buses, routes, and staff.

### Query Parameters

None (returns current system state)

### Response Structure

```json
{
  "success": true,
  "data": {
    "schools": {
      "total": 24,
      "active": 22,
      "inactive": 2,
      "newThisMonth": 3,
      "growthRate": 12.5
    },
    "customers": {
      "total": 18,
      "active": 16,
      "inactive": 2,
      "newThisMonth": 2,
      "growthRate": 11.1,
      "subscriptions": {
        "active": 16,
        "expired": 2,
        "pending": 0
      }
    },
    "students": {
      "total": 8457,
      "active": 8234,
      "inactive": 223,
      "newThisMonth": 342,
      "growthRate": 4.2,
      "byGrade": [
        {
          "grade": "Kindergarten",
          "count": 1250
        },
        {
          "grade": "Grade 1-3",
          "count": 2340
        },
        {
          "grade": "Grade 4-6",
          "count": 1890
        },
        {
          "grade": "Grade 7-8",
          "count": 1567
        },
        {
          "grade": "High School",
          "count": 1410
        }
      ]
    },
    "rfid": {
      "totalTags": 8457,
      "activeTags": 8234,
      "inactiveTags": 223,
      "assignedTags": 8234,
      "unassignedTags": 223,
      "replacementTags": 45,
      "averageTagAge": 8.5,
      "tagsByStatus": {
        "active": 8234,
        "inactive": 223,
        "damaged": 12,
        "lost": 8,
        "pending": 3
      }
    },
    "buses": {
      "total": 87,
      "active": 82,
      "inactive": 5,
      "inService": 79,
      "maintenance": 3,
      "totalCapacity": 3480,
      "averageCapacity": 40
    },
    "routes": {
      "total": 142,
      "active": 138,
      "inactive": 4,
      "morningRoutes": 71,
      "afternoonRoutes": 67
    },
    "drivers": {
      "total": 142,
      "active": 138,
      "inactive": 4,
      "licensed": 142,
      "certified": 135
    },
    "minders": {
      "total": 156,
      "active": 151,
      "inactive": 5,
      "certified": 148
    },
    "parents": {
      "total": 6876,
      "active": 6543,
      "inactive": 333,
      "verified": 6456,
      "unverified": 420,
      "newThisMonth": 234
    }
  }
}
```

### Notes

- `growthRate` is calculated as percentage change from previous month
- `newThisMonth` includes entities created in the current calendar month
- `tagsByStatus` should include all possible RFID tag statuses
- `byGrade` array should cover all grade levels in the system

---

## 2. Telemetry Summary (Performance Metrics)

### Endpoint

```
GET /admin/telemetry/summary
```

### Query Parameters

- `from` (required): ISO 8601 date string - Start date
- `to` (required): ISO 8601 date string - End date
- `compare` (optional): boolean - If true, include previous period comparison data

### Response Structure

```json
{
  "success": true,
  "data": {
    "period": {
      "from": "2024-12-24T00:00:00.000Z",
      "to": "2024-12-31T23:59:59.999Z"
    },
    "rfid": {
      "totalAttempts": 1573,
      "successfulScans": 1523,
      "failures": 50,
      "successRate": 96.82,
      "averageScanTime": 1.2,
      "peakHour": "07:30",
      "totalDevices": 12,
      "activeDevices": 11
    },
    "sms": {
      "totalAttempts": 4238,
      "successfulDeliveries": 4178,
      "failures": 60,
      "successRate": 98.58,
      "averageDeliveryTime": 3.5,
      "peakHour": "08:00",
      "providers": [
        {
          "name": "Safaricom",
          "deliveries": 2341,
          "successRate": 99.2
        },
        {
          "name": "Airtel",
          "deliveries": 1897,
          "successRate": 97.8
        }
      ]
    },
    "trips": {
      "totalTrips": 142,
      "completedTrips": 138,
      "inProgressTrips": 3,
      "cancelledTrips": 1,
      "averageDuration": 45,
      "totalStudentsTracked": 2847,
      "totalDistance": 3420
    },
    "system": {
      "uptime": 99.87,
      "averageResponseTime": 145,
      "apiErrors": 23,
      "databaseQueries": 124567,
      "cacheHitRate": 87.3
    },
    "previousPeriod"?: {
      "rfid": {
        "totalAttempts": 1489,
        "successfulScans": 1435,
        "failures": 54,
        "successRate": 96.37
      },
      "sms": {
        "totalAttempts": 4156,
        "successfulDeliveries": 4089,
        "failures": 67,
        "successRate": 98.39
      }
    }
  }
}
```

---

## 3. Daily Statistics

### Endpoint

```
GET /admin/telemetry/daily
```

### Query Parameters

- `from` (required): ISO 8601 date string - Start date
- `to` (required): ISO 8601 date string - End date

### Response Structure

```json
{
  "success": true,
  "data": [
    {
      "date": "2024-12-24",
      "rfid": {
        "attempts": 187,
        "successes": 181,
        "failures": 6
      },
      "sms": {
        "attempts": 523,
        "successes": 516,
        "failures": 7
      },
      "trips": {
        "scheduled": 18,
        "completed": 17,
        "cancelled": 1
      }
    },
    {
      "date": "2024-12-25",
      "rfid": {
        "attempts": 165,
        "successes": 160,
        "failures": 5
      },
      "sms": {
        "attempts": 487,
        "successes": 480,
        "failures": 7
      },
      "trips": {
        "scheduled": 16,
        "completed": 15,
        "cancelled": 1
      }
    }
  ]
}
```

---

## 4. Device Performance

### Endpoint

```
GET /admin/telemetry/devices
```

### Query Parameters

- `from` (required): ISO 8601 date string - Start date
- `to` (required): ISO 8601 date string - End date
- `deviceId` (optional): Filter by specific device ID
- `busId` (optional): Filter by bus ID

### Response Structure

```json
{
  "success": true,
  "data": [
    {
      "deviceId": "RFID-Reader-001",
      "busId": "bus-uuid-001",
      "busRegistration": "KBU 253J",
      "totalScans": 234,
      "failures": 5,
      "successRate": 97.86,
      "lastActive": "2024-12-31T08:30:00.000Z",
      "averageScanTime": 1.1,
      "totalUptime": 98.5
    },
    {
      "deviceId": "RFID-Reader-002",
      "busId": "bus-uuid-002",
      "busRegistration": "KCK 187B",
      "totalScans": 198,
      "failures": 8,
      "successRate": 95.96,
      "lastActive": "2024-12-31T08:15:00.000Z",
      "averageScanTime": 1.3,
      "totalUptime": 96.2
    }
  ]
}
```

---

## 5. Route Performance

### Endpoint

```
GET /admin/telemetry/routes
```

### Query Parameters

- `from` (required): ISO 8601 date string - Start date
- `to` (required): ISO 8601 date string - End date
- `routeId` (optional): Filter by specific route ID

### Response Structure

```json
{
  "success": true,
  "data": [
    {
      "routeId": "route-uuid-001",
      "routeName": "Westlands - Sunshine Elementary",
      "trips": 28,
      "avgDuration": 42,
      "onTimeRate": 96.4,
      "studentsServed": 234,
      "totalDistance": 280,
      "averageDistance": 10,
      "totalPickups": 234,
      "totalDropoffs": 234
    },
    {
      "routeId": "route-uuid-002",
      "routeName": "Karen - Sunshine Elementary",
      "trips": 25,
      "avgDuration": 48,
      "onTimeRate": 92.0,
      "studentsServed": 187,
      "totalDistance": 250,
      "averageDistance": 10,
      "totalPickups": 187,
      "totalDropoffs": 187
    }
  ]
}
```

---

## 6. RFID Failures

### Endpoint

```
GET /admin/telemetry/rfid-failures
```

### Query Parameters

- `from` (optional): ISO 8601 date string - Start date
- `to` (optional): ISO 8601 date string - End date
- `deviceId` (optional): Filter by device ID
- `busId` (optional): Filter by bus ID
- `studentId` (optional): Filter by student ID
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 50)
- `search` (optional): Search query

### Response Structure

```json
{
  "success": true,
  "data": {
    "failures": [
      {
        "id": "failure-uuid-001",
        "deviceId": "RFID-Reader-001",
        "appVersion": "2.4.0",
        "busId": "bus-uuid-001",
        "busRegistration": "KBU 253J",
        "rfidTagId": "RFID-001-ABC123",
        "student": {
          "id": "student-uuid-001",
          "name": "Kevin Mwangi",
          "photo": "/photos/student-001.jpg",
          "dateOfBirth": "2010-03-15",
          "age": 14
        },
        "minderId": "minder-uuid-001",
        "minderName": "Faith Wangari",
        "failureTime": "2024-12-31T08:30:00.000Z",
        "failureReason": "RFID tag not detected",
        "tripId": "trip-uuid-001",
        "location": {
          "latitude": -1.2921,
          "longitude": 36.8219
        }
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 50,
      "total": 50,
      "totalPages": 1
    }
  }
}
```

---

## 7. SMS Failures

### Endpoint

```
GET /admin/telemetry/sms-failures
```

### Query Parameters

- `from` (optional): ISO 8601 date string - Start date
- `to` (optional): ISO 8601 date string - End date
- `tripId` (optional): Filter by trip ID
- `parentId` (optional): Filter by parent ID
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Items per page (default: 50)
- `search` (optional): Search query

### Response Structure

```json
{
  "success": true,
  "data": {
    "failures": [
      {
        "id": "sms-failure-uuid-001",
        "parentId": "parent-uuid-001",
        "parentName": "Peter Mwangi",
        "phoneNumber": "+254712345678",
        "tripId": "trip-uuid-001",
        "trip": {
          "id": "trip-uuid-001",
          "number": "TR001",
          "route": {
            "id": "route-uuid-001",
            "name": "Westlands - Sunshine Elementary"
          },
          "startTime": "2024-12-31T07:30:00.000Z",
          "endTime": "2024-12-31T08:00:00.000Z",
          "status": "COMPLETED",
          "driver": {
            "id": "driver-uuid-001",
            "name": "Joseph Kamau"
          },
          "bus": {
            "id": "bus-uuid-001",
            "registrationNumber": "KBU 253J"
          }
        },
        "failureTime": "2024-12-31T08:35:00.000Z",
        "failureReason": "Network timeout",
        "messageType": "PICKUP_NOTIFICATION",
        "provider": "Safaricom",
        "retryCount": 2
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 50,
      "total": 60,
      "totalPages": 2
    }
  }
}
```

---

## 7. Failure Reasons Breakdown

### Endpoint

```
GET /admin/telemetry/failure-reasons
```

### Query Parameters

- `from` (required): ISO 8601 date string - Start date
- `to` (required): ISO 8601 date string - End date
- `type` (optional): "rfid" | "sms" | "all" (default: "all")

### Response Structure

```json
{
  "success": true,
  "data": {
    "rfid": [
      {
        "reason": "RFID tag not detected",
        "count": 15,
        "percentage": 30.0
      },
      {
        "reason": "RFID reader connection error",
        "count": 12,
        "percentage": 24.0
      },
      {
        "reason": "RFID tag damaged or unreadable",
        "count": 10,
        "percentage": 20.0
      }
    ],
    "sms": [
      {
        "reason": "Network timeout",
        "count": 25,
        "percentage": 41.7
      },
      {
        "reason": "Invalid phone number",
        "count": 15,
        "percentage": 25.0
      },
      {
        "reason": "SMS gateway error",
        "count": 10,
        "percentage": 16.7
      }
    ]
  }
}
```

---

## API Endpoint Summary

1. **GET /admin/telemetry/system-summary** - System-wide statistics (schools, customers, students, RFID tags, etc.)
2. **GET /admin/telemetry/summary** - Performance metrics for selected period
3. **GET /admin/telemetry/daily** - Daily breakdown statistics
4. **GET /admin/telemetry/devices** - Device performance metrics
5. **GET /admin/telemetry/routes** - Route performance metrics
6. **GET /admin/telemetry/rfid-failures** - RFID failure list
7. **GET /admin/telemetry/sms-failures** - SMS failure list
8. **GET /admin/telemetry/failure-reasons** - Failure reasons breakdown

---

## Error Responses

All endpoints should return errors in the following format:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "The 'from' date must be before the 'to' date",
    "details": {}
  }
}
```

### Common Error Codes

- `INVALID_DATE_RANGE`: Invalid date range provided
- `UNAUTHORIZED`: User not authenticated
- `FORBIDDEN`: User lacks required permissions
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Internal server error

---

## Authentication & Authorization

All endpoints require:

- Authentication: Bearer token in Authorization header
- Authorization: User must have `admin` or `telemetry:read` permission

---

## Rate Limiting

- Summary endpoint: 10 requests per minute
- Daily statistics: 20 requests per minute
- Device/Route performance: 30 requests per minute
- Failure lists: 60 requests per minute

---

## Notes for Backend Implementation

1. **Date Range Validation**: Ensure `from` date is always before `to` date
2. **Default Date Range**: If not provided, default to last 7 days
3. **Maximum Date Range**: Limit to 90 days for performance
4. **Pagination**: Always paginate large result sets (failures list)
5. **Caching**: Consider caching summary and daily statistics (5-15 minute TTL)
6. **Database Indexing**: Ensure indexes on:
   - `failure_time` / `created_at` columns
   - `device_id` for RFID failures
   - `trip_id` for SMS failures
   - `route_id` for route performance
7. **Aggregations**: Pre-calculate daily statistics in a separate table for better performance
8. **Previous Period Comparison**: Calculate previous period based on date range duration (e.g., if 7 days, compare to previous 7 days)
