import FRCallback from '.';
import { Callback } from '../../auth/interfaces';

/**
 * Represents a callback used to collect a valid platform username.
 */
class ValidatedCreateUsernameCallback extends FRCallback {
  /**
   * @param payload The raw payload returned by OpenAM
   */
  constructor(public payload: Callback) {
    super(payload);
  }

  /**
   * Gets the callback's prompt.
   */
  public getPrompt(): string {
    return this.getOutputValue('prompt');
  }

  /**
   * Gets whether the username is required.
   */
  public isRequired(): boolean {
    return this.getOutputValue('required');
  }

  /**
   * Gets the username policy keys.
   */
  public getPolicyKeys(): string[] {
    return this.getOutputValue('policies');
  }

  /**
   * Gets the username policy keys that are not satisfied.
   */
  public getFailedPolicyKeys(): string[] {
    return this.getOutputValue('failedPolicies');
  }

  /**
   * Sets the callback's username.
   */
  public setName(name: string) {
    this.setInputValue(name);
  }
}

export default ValidatedCreateUsernameCallback;
