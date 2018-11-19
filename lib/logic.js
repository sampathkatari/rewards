/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit */
var NS = "org.rewards.network"
/**
* This function is for rewarding customer 
* @param {org.rewards.network.rewardCustomer} rewardCustomer
* @transaction
*/
async function rewardCustomer(rewardCustomer) {
  var customer = rewardCustomer.customer
  customer.availablePoints = customer.availablePoints + rewardCustomer.points
  const customerRegistry = await getParticipantRegistry(NS + ".Customer")
  await customerRegistry.update(customer)
}

/**
* This function is for buying products by the customer using his reward points
* @param {org.rewards.network.buyProduct} buyProduct
* @transaction
*/
function buyProduct(buyProduct) {
  var customer = buyProduct.customer
  var product = buyProduct.product
  var seller = buyProduct.seller
  if(customer.availablePoints < product.costInRewards) {
  	throw new Error("You have less points. Hence you cannot buy the product.")
  }
  customer.availablePoints = customer.availablePoints - product.costInRewards
  return getParticipantRegistry(NS + ".Customer")
  .then(function(customerRegistry) {
  	return customerRegistry.update(customer)
  })
  .then(function(){
  	return getParticipantRegistry(NS + ".Seller")
  })
  .then(function(sellerRegistry) {
    seller.availablePoints = seller.availablePoints + product.costInRewards
  	return sellerRegistry.update(seller)
  })
}
