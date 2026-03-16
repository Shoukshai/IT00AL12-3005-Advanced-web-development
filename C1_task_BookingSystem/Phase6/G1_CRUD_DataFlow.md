# G1 CRUD Data Flow - Booking System Phase6

This document models the complete CRUD (Create, Read, Update, Delete) operations for Resources in the Booking System Phase6, based on actual implementation verified through Developer Tools.

---

## 1️⃣ CREATE – Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js and resources.js)
    participant B as Backend (Express Route)
    participant V as express-validator
    participant L as Log Service
    participant DB as PostgreSQL

    U->>F: Submit form (Create button)
    F->>F: Client-side validation
    F->>B: POST /api/resources (JSON payload)

    B->>V: Validate request
    V-->>B: Validation result

    alt Validation fails
        B-->>F: 400 Bad Request + errors[]
        F-->>U: Show validation message
    else Validation OK
        B->>DB: INSERT INTO resources
        DB-->>B: Result / Duplicate error (23505)

        alt Duplicate (23505)
            B->>L: Log duplicate attempt
            B-->>F: 409 Conflict
            F-->>U: Show duplicate message
        else Success
            B->>L: Log resource created
            B-->>F: 201 Created + resource data
            F->>F: Trigger onResourceActionSuccess
            F-->>U: Show success message
        end
    end
```

**Endpoint:** `POST /api/resources`

**Success:** 201 Created with resource data

**Failures:**
- 400 Bad Request: Validation errors
- 409 Conflict: Duplicate resource name
- 500 Internal Server Error: Database error

---

## 2️⃣ READ – Resources (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (resources.js)
    participant B as Backend (Express Route)
    participant DB as PostgreSQL

    U->>F: Page load / Refresh
    F->>B: GET /api/resources

    B->>DB: SELECT * FROM resources ORDER BY created_at DESC
    DB-->>B: Result set

    alt Database error
        B-->>F: 500 Internal Server Error
        F-->>U: Show error message
    else Success
        B-->>F: 200 OK + resources array
        F->>F: Render resource list
        F-->>U: Display resources
    end

    Note over U,F: User selects a resource

    U->>F: Click on resource
    F->>B: GET /api/resources/:id

    B->>B: Validate ID (isNaN check)

    alt Invalid ID
        B-->>F: 400 Bad Request
        F-->>U: Show error message
    else Valid ID
        B->>DB: SELECT * FROM resources WHERE id = $1
        DB-->>B: Result

        alt Not found
            B-->>F: 404 Not Found
            F-->>U: Show not found message
        else Found
            B-->>F: 200 OK + resource data
            F->>F: Populate form fields
            F-->>U: Display resource in form
        end
    end
```

**Endpoints:**
- `GET /api/resources` - Read all resources
- `GET /api/resources/:id` - Read single resource

**Success:**
- 200 OK with data (array or single object)

**Failures:**
- 400 Bad Request: Invalid ID format
- 404 Not Found: Resource doesn't exist
- 500 Internal Server Error: Database error

---

## 3️⃣ UPDATE – Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js and resources.js)
    participant B as Backend (Express Route)
    participant V as express-validator
    participant L as Log Service
    participant DB as PostgreSQL

    U->>F: Modify form and click Update
    F->>F: Check resourceId exists
    
    alt No resourceId
        F-->>U: Show error (Select resource first)
    else resourceId exists
        F->>F: Client-side validation
        F->>B: PUT /api/resources/:id (JSON payload)

        B->>B: Validate ID (isNaN check)

        alt Invalid ID
            B-->>F: 400 Bad Request
            F-->>U: Show error message
        else Valid ID
            B->>V: Validate request body
            V-->>B: Validation result

            alt Validation fails
                B-->>F: 400 Bad Request + errors[]
                F-->>U: Show validation errors
            else Validation OK
                B->>DB: UPDATE resources SET ... WHERE id = $6
                DB-->>B: Result / Duplicate error (23505)

                alt Not found (0 rows)
                    B-->>F: 404 Not Found
                    F-->>U: Show not found message
                else Duplicate (23505)
                    B-->>F: 409 Conflict
                    F-->>U: Show duplicate message
                else Success
                    B->>L: Log resource updated
                    B-->>F: 200 OK + updated data
                    F->>F: Trigger onResourceActionSuccess
                    F-->>U: Show success message
                end
            end
        end
    end
```

**Endpoint:** `PUT /api/resources/:id`

**Success:** 200 OK with updated resource data

**Failures:**
- 400 Bad Request: Invalid ID or validation errors
- 404 Not Found: Resource doesn't exist
- 409 Conflict: Duplicate resource name
- 500 Internal Server Error: Database error

---

## 4️⃣ DELETE – Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js and resources.js)
    participant B as Backend (Express Route)
    participant L as Log Service
    participant DB as PostgreSQL

    U->>F: Click Delete button
    F->>F: Check resourceId exists
    
    alt No resourceId
        F-->>U: Show error (Select resource first)
    else resourceId exists
        F->>B: DELETE /api/resources/:id (no body)

        B->>B: Validate ID (isNaN check)

        alt Invalid ID
            B-->>F: 400 Bad Request
            F-->>U: Show error message
        else Valid ID
            B->>DB: DELETE FROM resources WHERE id = $1
            DB-->>B: Result (rowCount)

            alt Not found (rowCount = 0)
                B-->>F: 404 Not Found
                F-->>U: Show not found message
            else Success (rowCount > 0)
                B->>L: Log resource deleted
                B-->>F: 204 No Content
                F->>F: Trigger onResourceActionSuccess
                F-->>U: Show success message
            end
        end
    end
```

**Endpoint:** `DELETE /api/resources/:id`

**Success:** 204 No Content (no response body)

**Failures:**
- 400 Bad Request: Invalid ID format
- 404 Not Found: Resource doesn't exist
- 500 Internal Server Error: Database error

---

## Verification Methods Used

1. **Browser Developer Tools:**
   - Network tab: Verified endpoints, methods, payloads, status codes
   - Console tab: Monitored client-side logs and errors

2. **Code Analysis:**
   - Backend routes: `/tmp/phase6/src/routes/resources.routes.js`
   - Frontend logic: `/tmp/phase6/public/form.js` and `/tmp/phase6/public/resources.js`
   - Validators: `/tmp/phase6/src/validators/resource.validators.js`

3. **Testing:**
   - Deployed Phase6 locally
   - Tested each CRUD operation through UI
   - Verified success and failure paths

---

## Key Implementation Details

- **Logging:** All successful mutations (Create, Update, Delete) are logged via Log Service
- **Validation:** Uses express-validator for server-side validation
- **Duplicate Detection:** PostgreSQL unique constraint (23505 error code)
- **ID Validation:** NaN check before database queries
- **Frontend Callback:** `window.onResourceActionSuccess` notifies UI layer after successful operations
