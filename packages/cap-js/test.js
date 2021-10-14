// import { cap } from './dist';
const { cap } = require('./dist');

cap.get_user_root_buckets({
  user: 'aaaaa-aa',
  witness: false,
}).then((indexCanisters) => {
  console.log('[debug] indexCanisters:', indexCanisters);
})

