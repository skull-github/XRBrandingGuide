# MLB XR Branding Guide - Development Workflow

## 🏗️ **Branch Strategy**

### **MAIN Branch (Default Working Branch)**
- ✅ **Primary development branch**
- ✅ **Always work here by default**
- ✅ **All new features and changes**
- ✅ **Quick iterations and testing**

### **STABLE Branch (Production Branch)**
- 🔐 **Password-protected deployments only**
- 🎯 **Stable, tested features only**
- 📦 **Production-ready releases**

## 🚀 **Deployment Scripts**

### **Quick Deploy to Main** (`./deploy-main.sh`)
```bash
./deploy-main.sh
```
- **No password required**
- **Fast deployment for development**
- **Use this for regular development pushes**

### **Secure Deploy to Stable** (`./deploy-stable.sh`)
```bash
./deploy-stable.sh
```
- **Password required**: `3333`
- **Final confirmation required**: `yes`
- **Use this for production releases only**

## 📋 **Recommended Workflow**

### **Daily Development:**
1. **Work on MAIN branch** (default)
2. **Make changes and commit**
3. **Push to main**: `./deploy-main.sh`
4. **Continue development**

### **Production Release:**
1. **Ensure all changes are on MAIN**
2. **Test thoroughly**
3. **Deploy to stable**: `./deploy-stable.sh`
4. **Enter password**: `3333`
5. **Confirm deployment**: `yes`

## 🎯 **Current Project Features**

### ✅ **Recently Completed:**
- **Official MLB spot colors** for all teams
- **Horizontal carousel layout** (logo-vs-logo design)
- **TeamGameCarousel component** replacing vertical layout
- **Secure deployment system** with password protection

### 🎨 **Team Section Layout:**
- **Live Game Context**: Horizontal carousel with logo-vs-logo cards
- **Upcoming Games**: Clean vertical list format
- **Official spot colors** used throughout

## 📊 **Branch Status**
- **MAIN**: Current development, always work here
- **STABLE**: Production releases, password-protected

## 🛡️ **Security**
- **Stable branch**: Protected with password "3333"
- **Main branch**: Open for development
- **All deployments**: Logged with timestamps

---

**Remember**: Always work on **MAIN** branch by default! 🎯
