# PaperNest API Documentation

## 📋 **Overview**

PaperNest adalah sistem manajemen paper akademik yang memfasilitasi kolaborasi antara mahasiswa dan dosen melalui workspace, document versioning, dan review workflows. API ini dibangun menggunakan ASP.NET Core dengan arsitektur RESTful.

## 🔗 **Base URL**

```
https://localhost:5001/api
```

## 📊 **HTTP Status Codes**

- **200 OK**: Request berhasil
- **201 Created**: Resource berhasil dibuat
- **400 Bad Request**: Input validation error
- **401 Unauthorized**: Authentication gagal
- **404 Not Found**: Resource tidak ditemukan
- **500 Internal Server Error**: Server error

## 🎯 **Response Format Standard**

Semua response menggunakan format JSON:

```json
{
  "message": "descriptive_message",
  "data": object_or_array
}
```

---

## 🔐 **1. Authentication API (`/api/auth`)**

### **POST /api/auth/register**

**Fungsi**: Registrasi user baru ke sistem

**Request Body**:

```json
{
  "name": "string (max 100 characters, required)",
  "email": "valid email (max 255 characters, required)",
  "username": "string (max 15 characters, required)",
  "password": "string (8-20 characters, required)",
  "role": "Student|Lecturer (default: Student)"
}
```

**Success Response (201 Created)**:

```json
{
  "message": "User successfully create account",
  "data": {
    "id": "guid",
    "name": "string",
    "email": "string",
    "username": "string",
    "role": "Student|Lecturer"
  }
}
```

**Error Response (400 Bad Request)**:

```json
{
  "errors": {
    "Email": ["The Email field is required."],
    "Password": ["Password must be at least 8 characters"]
  }
}
```

---

### **POST /api/auth/login**

**Fungsi**: Login user ke sistem

**Request Body**:

```json
{
  "email": "valid email (required)",
  "password": "string (required)"
}
```

**Success Response (200 OK)**:

```json
{
  "message": "User Successfully Login",
  "data": {
    "email": "user@email.com",
    "password": "hashed_password"
  }
}
```

**Error Response (401 Unauthorized)**:

```json
{
  "message": "Email or Password incorrect"
}
```

---

### **POST /api/auth/reset-password**

**Fungsi**: Reset password user

**Query Parameters**:

- `userEmail` (string, required): Email user
- `newPassword` (string, required): Password baru

**Success Response (200 OK)**:

```json
{
  "message": "Password successfully resetted"
}
```

**Error Response (404 Not Found)**:

```json
{
  "message": "User not found [Reset Password Gagal]"
}
```

---

### **POST /api/auth/change-email**

**Fungsi**: Ubah email user

**Request Body**:

```json
{
  "oldEmail": "valid email (required)",
  "newEmail": "valid email (required)"
}
```

**Success Response (200 OK)**:

```json
{
  "message": "Email successfully changed"
}
```

---

## 👥 **2. User Management API (`/api/users`)**

### **GET /api/users**

**Fungsi**: Ambil semua data user

**Success Response (200 OK)**:

```json
{
  "message": "Success get all User data",
  "data": [
    {
      "id": "guid",
      "name": "string",
      "email": "string",
      "username": "string",
      "role": "Student|Lecturer"
    }
  ]
}
```

---

### **GET /api/users/{id}**

**Fungsi**: Ambil user berdasarkan ID

**Path Parameters**:

- `id` (Guid, required): User ID

**Success Response (200 OK)**:

```json
{
  "message": "Success get all User data with id: {user_id}",
  "data": {
    "id": "guid",
    "name": "string",
    "email": "string",
    "username": "string",
    "role": "Student|Lecturer"
  }
}
```

**Error Response (404 Not Found)**: Empty response

---

### **PUT /api/users/{id}**

**Fungsi**: Update data user

**Path Parameters**:

- `id` (Guid, required): User ID

**Request Body**:

```json
{
  "name": "string",
  "username": "string"
}
```

**Success Response (200 OK)**:

```json
{
  "message": "Success to update user with id: {user_id}"
}
```

---

### **DELETE /api/users/id**

**Fungsi**: Hapus user

**Query Parameters**:

- `id` (Guid, required): User ID

**Success Response (200 OK)**:

```json
{
  "message": "User has been deleted"
}
```

---

## 🏢 **3. Workspace Management API (`/api/workspaces`)**

### **GET /api/workspaces**

**Fungsi**: Ambil semua workspace

**Success Response (200 OK)**:

```json
{
  "message": "Success get all workspace",
  "data": [
    {
      "id": "guid",
      "name": "string",
      "description": "string",
      "createdAt": "datetime",
      "ownerId": "guid"
    }
  ]
}
```

---

### **GET /api/workspaces/{id}**

**Fungsi**: Ambil workspace berdasarkan ID

**Path Parameters**:

- `id` (Guid, required): Workspace ID

**Success Response (200 OK)**:

```json
{
  "message": "Success get workspace data",
  "data": {
    "id": "guid",
    "name": "string",
    "description": "string",
    "createdAt": "datetime",
    "ownerId": "guid"
  }
}
```

**Error Response (404 Not Found)**:

```json
{
  "message": "Workspace not found"
}
```

---

### **GET /api/workspaces/user/{userId}**

**Fungsi**: Ambil workspace yang dimiliki user

**Path Parameters**:

- `userId` (Guid, required): User ID

**Success Response (200 OK)**:

```json
{
  "message": "Success get user's workspace",
  "data": [
    {
      "id": "guid",
      "name": "string",
      "description": "string",
      "createdAt": "datetime",
      "ownerId": "guid"
    }
  ]
}
```

---

### **GET /api/workspaces/joined/{userId}**

**Fungsi**: Ambil workspace yang diikuti user

**Path Parameters**:

- `userId` (Guid, required): User ID

**Success Response (200 OK)**:

```json
{
  "message": "Success get joined workspace",
  "data": [
    {
      "id": "guid",
      "name": "string",
      "description": "string",
      "createdAt": "datetime",
      "ownerId": "guid"
    }
  ]
}
```

---

### **GET /api/workspaces/{workspaceId}/user/{userId}/role**

**Fungsi**: Ambil role user dalam workspace tertentu

**Path Parameters**:

- `workspaceId` (Guid, required): Workspace ID
- `userId` (Guid, required): User ID

**Success Response (200 OK)**:

```json
{
  "message": "Success get user role in workspace",
  "data": {
    "role": "Owner|Member|Lecturer"
  }
}
```

---

### **POST /api/workspaces**

**Fungsi**: Buat workspace baru

**Request Body**:

```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "ownerId": "guid (required)"
}
```

**Success Response (201 Created)**:

```json
{
  "message": "Success create new workspace",
  "data": {
    "id": "guid",
    "name": "string",
    "description": "string",
    "createdAt": "datetime",
    "ownerId": "guid"
  }
}
```

---

### **POST /api/workspaces/join**

**Fungsi**: Join workspace

**Query Parameters**:

- `workspaceId` (Guid, required): Workspace ID
- `userId` (Guid, required): User ID
- `role` (WorkspaceRole, optional): Default "Lecturer"

**Success Response (200 OK)**:

```json
{
  "message": "Success joined workspace",
  "data": {
    "workspace": {
      "id": "guid",
      "name": "string",
      "description": "string"
    },
    "userWorkspace": {
      "id": "guid",
      "userId": "guid",
      "workspaceId": "guid",
      "role": "Owner|Member|Lecturer"
    }
  }
}
```

**Error Response (404 Not Found)**:

```json
{
  "message": "Workspace not found"
}
```

---

### **PUT /api/workspaces/{id}**

**Fungsi**: Update workspace

**Path Parameters**:

- `id` (Guid, required): Workspace ID

**Request Body**:

```json
{
  "name": "string",
  "description": "string"
}
```

**Success Response (200 OK)**:

```json
{
  "message": "Success update workspace",
  "data": {
    "id": "guid",
    "name": "string",
    "description": "string",
    "createdAt": "datetime",
    "ownerId": "guid"
  }
}
```

---

### **DELETE /api/workspaces/{id}**

**Fungsi**: Hapus workspace

**Path Parameters**:

- `id` (Guid, required): Workspace ID

**Success Response (200 OK)**:

```json
{
  "message": "Workspace has been deleted"
}
```

**Error Response (404 Not Found)**:

```json
{
  "message": "Workspace not found"
}
```

---

## 📄 **4. Document Management API (`/api/documents`)**

### **GET /api/documents**

**Fungsi**: Ambil semua dokumen

**Success Response (200 OK)**:

```json
{
  "message": "Success get all documents",
  "data": [
    {
      "id": "guid",
      "title": "string",
      "description": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "userId": "guid",
      "workspaceId": "guid"
    }
  ]
}
```

---

### **GET /api/documents/{id}**

**Fungsi**: Ambil dokumen berdasarkan ID

**Path Parameters**:

- `id` (Guid, required): Document ID

**Success Response (200 OK)**:

```json
{
  "message": "Success get all documents",
  "data": {
    "id": "guid",
    "title": "string",
    "description": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "userId": "guid",
    "workspaceId": "guid"
  }
}
```

**Error Response (404 Not Found)**:

```json
{
  "message": "Doccument not found"
}
```

---

### **GET /api/documents/user/{userId}**

**Fungsi**: Ambil dokumen yang dimiliki user

**Path Parameters**:

- `userId` (Guid, required): User ID

**Success Response (200 OK)**:

```json
{
  "message": "Success get document owned by user",
  "data": [
    {
      "id": "guid",
      "title": "string",
      "description": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "userId": "guid",
      "workspaceId": "guid"
    }
  ]
}
```

---

### **GET /api/documents/workspace/{workspaceId}**

**Fungsi**: Ambil dokumen dalam workspace tertentu

**Path Parameters**:

- `workspaceId` (Guid, required): Workspace ID

**Success Response (200 OK)**:

```json
{
  "message": "Success get all documents in workspace",
  "data": [
    {
      "id": "guid",
      "title": "string",
      "description": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "userId": "guid",
      "workspaceId": "guid"
    }
  ]
}
```

---

### **POST /api/documents**

**Fungsi**: Buat dokumen baru

**Request Body**:

```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "userId": "guid (required)",
  "workspaceId": "guid (required)"
}
```

**Success Response (201 Created)**:

```json
{
  "message": "Success create new document",
  "data": {
    "id": "guid",
    "title": "string",
    "description": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "userId": "guid",
    "workspaceId": "guid"
  }
}
```

---

### **PUT /api/documents/{id}**

**Fungsi**: Update dokumen

**Path Parameters**:

- `id` (Guid, required): Document ID

**Request Body**:

```json
{
  "title": "string",
  "description": "string"
}
```

**Success Response (200 OK)**:

```json
{
  "message": "Success to update document",
  "data": {
    "id": "guid",
    "title": "string",
    "description": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "userId": "guid",
    "workspaceId": "guid"
  }
}
```

**Error Response (404 Not Found)**:

```json
{
  "message": "Document not found"
}
```

---

### **DELETE /api/documents/{id}**

**Fungsi**: Hapus dokumen

**Path Parameters**:

- `id` (Guid, required): Document ID

**Success Response (200 OK)**:

```json
{
  "message": "Document has been deleted"
}
```

**Error Response (404 Not Found)**:

```json
{
  "message": "Document not found"
}
```

---

## 📝 **5. Document Version API (`/api/document`)**

### **GET /api/document/{documentId}/versions**

**Fungsi**: Ambil semua versi dari dokumen

**Path Parameters**:

- `documentId` (Guid, required): Document ID

**Success Response (200 OK)**:

```json
[
  {
    "id": "guid",
    "comment": "string",
    "content": "string",
    "createdAt": "datetime",
    "documentId": "guid",
    "userCreatorId": "guid"
  }
]
```

---

### **POST /api/document/{documentId}/version**

**Fungsi**: Buat versi baru dokumen

**Path Parameters**:

- `documentId` (Guid, required): Document ID

**Query Parameters**:

- `userCreatorId` (Guid, required): User Creator ID

**Request Body**:

```json
{
  "comment": "string (max 255 characters, required)",
  "content": "string (required)"
}
```

**Success Response (201 Created)**:

```json
{
  "id": "guid",
  "comment": "string",
  "content": "string",
  "createdAt": "datetime",
  "documentId": "guid",
  "userCreatorId": "guid"
}
```

---

### **GET /api/document/{documentId}/version/{documentBodyId}**

**Fungsi**: Ambil versi spesifik dokumen

**Path Parameters**:

- `documentId` (Guid, required): Document ID
- `documentBodyId` (Guid, required): Document Body ID

**Success Response (200 OK)**:

```json
{
  "id": "guid",
  "comment": "string",
  "content": "string",
  "createdAt": "datetime",
  "documentId": "guid",
  "userCreatorId": "guid"
}
```

**Error Response (404 Not Found)**: Empty response

---

### **GET /api/document/{documentId}/version/current**

**Fungsi**: Ambil versi terkini dokumen

**Path Parameters**:

- `documentId` (Guid, required): Document ID

**Success Response (200 OK)**:

```json
{
  "id": "guid",
  "comment": "string",
  "content": "string",
  "createdAt": "datetime",
  "documentId": "guid",
  "userCreatorId": "guid"
}
```

**Error Response (404 Not Found)**: Empty response

---

## 📖 **6. Citation Management API (`/api/citations`)**

### **GET /api/citations**

**Fungsi**: Ambil semua sitasi

**Success Response (200 OK)**:

```json
{
  "message": "Success get all citations",
  "data": [
    {
      "id": "guid",
      "type": "CitationType",
      "title": "string",
      "author": "string",
      "publicationInfo": "string",
      "publicationDate": "datetime",
      "accessDate": "datetime",
      "DOI": "string",
      "FK_DocumentId": "guid"
    }
  ]
}
```

---

### **GET /api/citations/{id}**

**Fungsi**: Ambil sitasi berdasarkan ID

**Path Parameters**:

- `id` (Guid, required): Citation ID

**Success Response (200 OK)**:

```json
{
  "message": "Success get citation by ID",
  "data": {
    "id": "guid",
    "type": "CitationType",
    "title": "string",
    "author": "string",
    "publicationInfo": "string",
    "publicationDate": "datetime",
    "accessDate": "datetime",
    "DOI": "string",
    "FK_DocumentId": "guid"
  }
}
```

**Error Response (404 Not Found)**:

```json
{
  "message": "Citation not found"
}
```

---

### **GET /api/citations/document/{documentId}**

**Fungsi**: Ambil sitasi berdasarkan dokumen

**Path Parameters**:

- `documentId` (Guid, required): Document ID

**Success Response (200 OK)**:

```json
{
  "message": "Success get citations by document ID",
  "data": [
    {
      "id": "guid",
      "type": "CitationType",
      "title": "string",
      "author": "string",
      "publicationInfo": "string",
      "publicationDate": "datetime",
      "accessDate": "datetime",
      "DOI": "string",
      "FK_DocumentId": "guid"
    }
  ]
}
```

---

### **POST /api/citations**

**Fungsi**: Buat sitasi baru

**Request Body**:

```json
{
  "type": "CitationType (required)",
  "title": "string (required)",
  "author": "string (required)",
  "publicationInfo": "string (required)",
  "FK_DocumentId": "guid (required)",
  "publicationDate": "datetime (optional)",
  "accessDate": "datetime (optional)",
  "DOI": "string (optional)"
}
```

**Success Response (201 Created)**:

```json
{
  "message": "Success create new citation",
  "data": {
    "id": "guid",
    "type": "CitationType",
    "title": "string",
    "author": "string",
    "publicationInfo": "string",
    "publicationDate": "datetime",
    "accessDate": "datetime",
    "DOI": "string",
    "FK_DocumentId": "guid"
  }
}
```

**Error Response (400 Bad Request)**:

```json
{
  "message": "Title, Author, and PublicationInfo are required."
}
```

---

### **PUT /api/citations/{id}**

**Fungsi**: Update sitasi

**Path Parameters**:

- `id` (Guid, required): Citation ID

**Request Body**:

```json
{
  "type": "CitationType",
  "title": "string (required)",
  "author": "string (required)",
  "publicationInfo": "string (required)",
  "publicationDate": "datetime (optional)",
  "accessDate": "datetime (optional)",
  "DOI": "string (optional)"
}
```

**Success Response (200 OK)**:

```json
{
  "message": "Success to update citation",
  "data": {
    "id": "guid",
    "type": "CitationType",
    "title": "string",
    "author": "string",
    "publicationInfo": "string",
    "publicationDate": "datetime",
    "accessDate": "datetime",
    "DOI": "string",
    "FK_DocumentId": "guid"
  }
}
```

**Error Response (404 Not Found)**:

```json
{
  "message": "Citation not found or update failed"
}
```

---

### **DELETE /api/citations/{id}**

**Fungsi**: Hapus sitasi

**Path Parameters**:

- `id` (Guid, required): Citation ID

**Success Response (200 OK)**:

```json
{
  "message": "Citation has been deleted"
}
```

**Error Response (404 Not Found)**:

```json
{
  "message": "Citation not found"
}
```

---

### **GET /api/citations/{id}/apa**

**Fungsi**: Ambil sitasi dalam format APA

**Path Parameters**:

- `id` (Guid, required): Citation ID

**Success Response (200 OK)**:

```json
{
  "message": "Success get APA style citation",
  "data": "formatted APA citation string"
}
```

**Error Response (404 Not Found)**:

```json
{
  "message": "Citation not found or could not be formatted."
}
```

---

## ✅ **7. Review Management API (`/api/review`)**

### **GET /api/review/{documentBodyId}**

**Fungsi**: Ambil review berdasarkan document body

**Path Parameters**:

- `documentBodyId` (Guid, required): Document Body ID

**Success Response (200 OK)**:

```json
[
  {
    "id": "guid",
    "comment": "string",
    "status": "Approved|NeedsRevision|Done",
    "createdAt": "datetime",
    "documentBodyId": "guid",
    "lecturerId": "guid"
  }
]
```

---

### **POST /api/review/{documentBodyId}/{UserLecturerId}**

**Fungsi**: Tambah review baru

**Path Parameters**:

- `documentBodyId` (Guid, required): Document Body ID
- `UserLecturerId` (Guid, required): Lecturer User ID

**Query Parameters**:

- `status` (ReviewStatus, required): Approved|NeedsRevision|Done

**Request Body**:

```json
"string comment"
```

**Success Response (201 Created)**: Returns created review object

---

### **DELETE /api/review/{reviewId}**

**Fungsi**: Hapus review

**Path Parameters**:

- `reviewId` (Guid, required): Review ID

**Success Response (200 OK)**:

```json
{
  "message": "Sukses menghapus review"
}
```

**Error Response (404 Not Found)**:

```json
{
  "message": "Review tidak ditemukan"
}
```

**Error Response (400 Bad Request)**:

```json
{
  "message": "Gagal menghapus review"
}
```

---

## 🔗 **8. User Workspace API (`/api/user/workspace`)**

### **GET /api/user/workspace**

**Fungsi**: Ambil semua relasi user-workspace

**Success Response (200 OK)**: Array of user-workspace relations

---

### **GET /api/user/workspace/id/{id}**

**Fungsi**: Ambil relasi user-workspace berdasarkan ID

**Path Parameters**:

- `id` (Guid, required): User Workspace ID

**Success Response (200 OK)**: User-workspace object

**Error Response (404 Not Found)**:

```json
{
  "message": "Relasi user-workspace tidak ditemukan"
}
```

---

### **GET /api/user/workspace/{userId}**

**Fungsi**: Ambil workspace yang diikuti user

**Path Parameters**:

- `userId` (Guid, required): User ID

**Success Response (200 OK)**: Array of user workspaces

**Error Response (404 Not Found)**:

```json
{
  "message": "User tidak memiliki workspace"
}
```

---

### **POST /api/user/workspace/{userId}/{workspaceId}**

**Fungsi**: Tambah user sebagai owner workspace

**Path Parameters**:

- `userId` (Guid, required): User ID
- `workspaceId` (Guid, required): Workspace ID

**Success Response (201 Created)**: Created relation object

---

### **POST /api/user/workspace/{userId}/{workspaceId}/join**

**Fungsi**: Tambah user sebagai member workspace

**Path Parameters**:

- `userId` (Guid, required): User ID
- `workspaceId` (Guid, required): Workspace ID

**Success Response (201 Created)**: Created relation object

---

### **POST /api/user/workspace/{userId}/{workspaceId}/lecturer/join**

**Fungsi**: Tambah user sebagai lecturer workspace

**Path Parameters**:

- `userId` (Guid, required): User ID
- `workspaceId` (Guid, required): Workspace ID

**Success Response (201 Created)**: Created relation object

---

### **DELETE /api/user/workspace/{userId}/{workspaceId}**

**Fungsi**: Hapus user dari workspace

**Path Parameters**:

- `userId` (Guid, required): User ID
- `workspaceId` (Guid, required): Workspace ID

**Success Response (200 OK)**:

```json
{
  "message": "Berhasil menghapus user dari workspace"
}
```

**Error Response (400 Bad Request)**:

```json
{
  "message": "Gagal menghapus user dari workspace"
}
```

---

## 🎯 **Data Types & Enums**

### **UserRole Enum**

- `Student`: Role mahasiswa
- `Lecturer`: Role dosen

### **WorkspaceRole Enum**

- `Owner`: Pemilik workspace (biasanya student yang membuat)
- `Member`: Anggota workspace
- `Lecturer`: Dosen dalam workspace

### **ReviewStatus Enum**

- `Approved`: Review disetujui
- `NeedsRevision`: Perlu revisi
- `Done`: Selesai

### **CitationType Enum**

Tipe sitasi yang didukung (perlu diperiksa di file CitationType.cs)

---

## 🔒 **Business Rules & Constraints**

### **Student Access Rights**

- ✅ Dapat membuat workspace baru
- ✅ Dapat mengelola workspace yang dimiliki
- ✅ Dapat membuat, edit, dan submit dokumen
- ✅ Dapat mengelola sitasi dalam dokumen
- ✅ Dapat mengundang user lain ke workspace

### **Lecturer Access Rights**

- ❌ Tidak dapat membuat workspace baru
- ✅ Dapat bergabung dengan workspace yang ada
- ✅ Dapat melihat dokumen (read-only)
- ✅ Dapat melakukan review dan memberikan feedback
- ✅ Dapat melihat semua versi dokumen dan sitasi

### **Document Versioning Rules**

- Versi baru tidak dapat dibuat sampai versi saat ini di-review
- Hanya ada satu versi "current" per dokumen
- Riwayat versi lengkap disimpan untuk audit
- Hanya pemilik dokumen (student) yang dapat membuat versi baru

### **Review Process Rules**

- Hanya lecturer yang dapat melakukan review
- Review bersifat final setelah disubmit
- Ada tiga kemungkinan hasil review: Approved, NeedsRevision, Done
- Student harus menunggu review selesai sebelum membuat versi baru

---

## 📚 **Error Handling Examples**

### **Validation Errors (400 Bad Request)**

```json
{
  "errors": {
    "Email": ["The Email field is required."],
    "Password": ["Password must be at least 8 characters"],
    "Name": ["Name max 100 characters"]
  }
}
```

### **Authentication Errors (401 Unauthorized)**

```json
{
  "message": "Email or Password incorrect"
}
```

### **Not Found Errors (404 Not Found)**

```json
{
  "message": "Resource not found"
}
```

### **Server Errors (500 Internal Server Error)**

```json
{
  "message": "An error occurred while processing the request.",
  "error": "detailed_error_message"
}
```

---

## 📋 **API Testing Examples**

### **Register New User**

```bash
curl -X POST "https://localhost:5001/api/auth/register" \
-H "Content-Type: application/json" \
-d '{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "password123",
  "role": "Student"
}'
```

### **Login User**

```bash
curl -X POST "https://localhost:5001/api/auth/login" \
-H "Content-Type: application/json" \
-d '{
  "email": "john@example.com",
  "password": "password123"
}'
```

### **Create Workspace**

```bash
curl -X POST "https://localhost:5001/api/workspaces" \
-H "Content-Type: application/json" \
-d '{
  "name": "Research Project",
  "description": "Academic research workspace",
  "ownerId": "user-guid-here"
}'
```

### **Create Document**

```bash
curl -X POST "https://localhost:5001/api/documents" \
-H "Content-Type: application/json" \
-d '{
  "title": "Research Paper",
  "description": "My research paper",
  "userId": "user-guid-here",
  "workspaceId": "workspace-guid-here"
}'
```

---

## 🔍 **Additional Notes**

1. **GUID Format**: Semua ID menggunakan format GUID standar
2. **DateTime Format**: Menggunakan ISO 8601 format
3. **Encoding**: Semua request/response menggunakan UTF-8
4. **Content-Type**: application/json untuk semua API calls
5. **Case Sensitivity**: Parameter names adalah case-sensitive

---

**Generated on**: June 12, 2025  
**API Version**: 1.0  
**Framework**: ASP.NET Core  
**Documentation**: Complete API Reference
