import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }
  // private usersEndpoint = "https://jsonplaceholder.typicode.com/users";
  private usersEndpoint = "http://localhost:8081/byte-crud";

  getUsers(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    // We do not subscribe here! We let the resolver take care of that...
    return this.http.get(this.usersEndpoint, { headers });
  }

  createUser(user: User): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.usersEndpoint + '/crear', user, { headers });
  }

  updateUser(user : User): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put(this.usersEndpoint + '/update', user, { headers });
  }

  deleteUser(id) : Observable<any>{
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.delete(this.usersEndpoint + `/delete?id=${id}`, { headers });
  }
}

//@CrossOrigin(origins = "*", methods= {RequestMethod.GET,RequestMethod.POST, RequestMethod.DELETE, RequestMethod.PUT, RequestMethod.PATCH})
