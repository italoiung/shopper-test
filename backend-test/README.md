# Backend test - Stage 1
Fluid consumption measurement API using Google Gemini to transcribe numeric values from uploaded images.

## Technologies used
- Node
- Typescript
- Express
- Prisma
- Google GenerativeAI
- ESLint + Prettier

## API Reference

#### Register measurement report

```http
  POST /upload
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `image` | `base64` | **Required**. Measurement report picture |
| `customer_code` | `string` | **Required**. Associated customer key  |
| `measure_datetime` | `datetime` | **Required**. Measurement period |
| `measure_type` | `string` | **Required**. Resource measured. `WATER` or `GAS` |

#### Check AI generated transcription

```http
  PATCH /confirm
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `measure_uuid`      | `string` | **Required**. Id of report to check |
| `confirmed_value`      | `string` | **Required**. User-checked value |


#### List customer's report

```http
  GET /<customer_code>/list?measure_type
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `customer_code` | `string` | **Required**. Customer id   |
| `measure_type`      | `string` | Filter by resource. `WATER` or `GAS` |

