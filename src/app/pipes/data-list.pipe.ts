import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataList'
})
export class DataListPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    var array = []
    if (value) {
      console.log(value['filteredData'], 'valores pipe')
      for (let index = 0; index < value['filteredData'].length; index++) {
        const element = value['filteredData'][index];
        array.push(element.name)
      }
    }
    console.log(args, 'argumentos pipe')
    console.log(array, 'retrono')
    return array;
  }

}
