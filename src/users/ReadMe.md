# NestJS Controller Patterns Guide

## Route Params & Optional Params in NestJS (v11)

### 1️⃣ Mandatory Route Param (Official & Supported) ✅

```typescript
@Get(':id')
getUser(@Param('id') id: string) { ... }
```

**Example:**
- `GET /users/123`
- `@Param('id')` === `'123'`

---

### 2️⃣ Optional Route Params Using `?` ❌ (NOT Supported)

```typescript
@Get(':id/:optional?')  // ❌ This will throw a runtime error
```

This syntax is **NOT supported** in NestJS v11. NestJS uses `path-to-regexp@6`, which does not allow optional route params using `?`.

---

### 3️⃣ Optional Route Params Using Regex Group ⚠️ (Works But NOT Official)

```typescript
@Get('/:id{/:optional}')
getUser(
  @Param('id') id: string,
  @Param('optional') optional?: string
) { ... }
```

This works because it leverages `path-to-regexp` regex grouping.

**Examples:**
- `GET /users/asdf`
  - `id` = `'asdf'`
  - `optional` = `undefined`

- `GET /users/asdf/1234`
  - `id` = `'asdf'`
  - `optional` = `'1234'`

**⚠️ Important Caveats:**
- This behavior is undocumented in NestJS
- Swagger/OpenAPI does NOT understand this properly
- Future NestJS versions may break this
- Not recommended for production code

---

### 4️⃣ RECOMMENDED Way to Handle Optional Data ✅

**Use QUERY PARAMETERS** instead of optional route params.

```typescript
@Get(':id')
getUser(
  @Param('id') id: string,
  @Query('optional') optional?: string,
  @Query('limit') limit?: number,
  @Query('offset') offset?: number
) { ... }
```

**Example:**
```
GET /users/123?optional=456&limit=10&offset=0
```

**Benefits:**
- Officially supported
- Idiomatic NestJS
- Swagger-friendly
- Safer for future upgrades

---

### 5️⃣ Alternative (Safe But Verbose)

Define two routes explicitly:

```typescript
@Get(':id')
getUserById(@Param('id') id: string) { ... }

@Get(':id/:optional')
getUserWithOptional(
  @Param('id') id: string,
  @Param('optional') optional: string
) { ... }
```

This is fully supported but increases code duplication.

---

## Request Body Handling in NestJS

### 1️⃣ `@Body()` ✅ (RECOMMENDED — Most Common Case)

Use `@Body()` when:
- You only need the request payload (JSON body)
- You want clean, readable, and testable controllers
- You plan to use DTOs and validation pipes

```typescript
@Post()
createUser(@Body() body: CreateUserDto) {
  // ...
}
```

**Example Request:**
```
POST /users
Body: { "name": "John", "email": "john@example.com" }
```

**Why This Is Preferred:**
- Keeps controllers framework-agnostic
- Works seamlessly with validation & transformation
- Encourages DTO-driven design
- Easier to mock in unit tests

---

### 2️⃣ `@Req()` ⚠️ (Low-Level — Use Sparingly)

Use `@Req()` when:
- You need access to the full request object
- You need headers, cookies, IP, or raw request data
- You are integrating with legacy Express middleware

```typescript
@Post()
createUser(@Req() req: Request) {
  const body = req.body;
  const authHeader = req.headers.authorization;
  const clientIp = req.ip;
  // ...
}
```

**Example Use Cases:**
- Reading Authorization headers manually
- Accessing cookies or session data
- Getting client IP or user-agent

**Downsides of `@Req()`:**
- Tightly couples controller to Express/Fastify
- Harder to test
- Bypasses NestJS abstractions
- Discourages DTO + validation usage

---

### 3️⃣ ❌ What NOT to Do

- Do **NOT** use `@Req()` just to access `req.body`
- Do **NOT** mix `@Req()` and `@Body()` for the same data
- Do **NOT** use `@Req()` by default out of habit

---

### 4️⃣ Rule of Thumb 🧠

- **If you only need request data** → use `@Body()`, `@Param()`, `@Query()`
- **If you need protocol-level details** → use `@Req()`

---

## Summary

| Pattern | Support Level | Use Case |
|---------|--------------|----------|
| `@Get(':id')` | ✅ Official | Mandatory route params |
| `@Get(':id/:optional?')` | ❌ Not supported | Avoid this |
| `@Get('/:id{/:optional}')` | ⚠️ Undocumented | Works but risky |
| `@Query()` for optional data | ✅ Recommended | Best practice for optional params |
| `@Body()` | ✅ Recommended | Standard request body handling |
| `@Req()` | ⚠️ Use sparingly | Low-level access when needed |