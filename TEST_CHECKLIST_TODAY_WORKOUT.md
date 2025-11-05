# 🧪 Quick Test Checklist - Workout Today Display

**Backend Status:** ✅ Running on port 5000  
**Frontend Status:** ✅ Running on port 5173

---

## Test Sequence

### Test 1: Backend Health Check ✅
```
GET http://localhost:5000/health
Expected: {"status":"ok", ...}
```

### Test 2: Create New Workout
**Steps:**
1. Go to `http://localhost:5173/add-workout`
2. Fill in:
   - Workout name: "Back Day"
   - Exercise 1: "Pull-up" (3 sets, 10 reps, 0 kg)
   - Exercise 2: "Barbell Row" (3 sets, 8 reps, 60 kg)
3. Click "Save Workout"
4. Expected: Success message, redirects to dashboard

### Test 3: Check Today's Workout ✅ **THIS IS THE KEY TEST**
**Steps:**
1. Go to `http://localhost:5173/today`
2. Expected: 
   - ✅ Shows "Back Day" workout
   - ✅ Shows both exercises (Pull-up, Barbell Row)
   - ✅ Shows sets/reps/weight for each
   - ✅ Can toggle exercises as complete
   - ❌ NOT "No Workout Today" error

### Test 4: Mark Exercise Complete
**Steps:**
1. On Today page, click exercise name to toggle complete
2. Expected: Exercise highlights/grays out

### Test 5: Complete Entire Workout
**Steps:**
1. Click "Complete Workout" button
2. Click "Yes" in confirmation dialog
3. Expected:
   - ✅ Shows success toast with "Undo" option
   - ✅ Redirects to dashboard
   - ✅ Workout removed from Today page (completed)

### Test 6: View in History
**Steps:**
1. Go to `http://localhost:5173/history`
2. Expected: See "Back Day" in workout list with "mark complete" status

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Still see 404 on Today page | 1. Refresh browser (Ctrl+F5) 2. Check backend logs 3. Restart backend |
| Workout doesn't save | Check Console for errors, verify backend is running |
| Backend won't start | Check if port 5000 is already in use: `netstat -ano \| findstr :5000` |
| MongoDB connection fails | Check `.env` file has correct `MONGO_URI` |

---

## Success Criteria

✅ All tests pass if:
- Workout saves without errors
- Immediately appears on Today page
- Shows all exercises with correct data
- Can mark exercises and workout as complete
- Appears in History after completion

---

## If Something Fails

**Check these in order:**

1. **Browser Console** (F12 → Console)
   - Look for red errors
   - Check Network tab for API responses

2. **Backend Terminal**
   - Check for error messages
   - Look for MongoDB logs

3. **Restart Backend**
   ```bash
   # Kill any existing node process
   # In backend folder: node server.js
   ```

4. **Clear Browser Cache**
   - Ctrl+Shift+Del
   - Clear all cache
   - Reload page

5. **Check Database**
   - Log into MongoDB Atlas
   - Check if workout document was created with `completed: false`

---

## Expected Response Flow

```
User creates workout with exercises
         ↓
Frontend validates form
         ↓
POST /workouts with data
         ↓
Backend validates input
         ↓
MongoDB saves with completed: false ← KEY FIX
         ↓
User goes to Today page
         ↓
Frontend calls GET /workouts/today
         ↓
Backend finds workouts where completed is false OR undefined
         ↓
Returns workout ← KEY FIX
         ↓
Frontend displays workout on page ✅
```

---

**Ready to test? Start with Test 2! 🚀**
