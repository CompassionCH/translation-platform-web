/**
 * We define a single Notyf instance to use in the application,
 * so that configuration is shared.
 */

import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({
  // Customize notifications here
  
  // Show it 5 seconds 
  duration: 5000,
});

export default notyf;