import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom, of, tap } from 'rxjs';
import Response from '../models/Response';
import User from '../models/User';
import SingleResponse from '../models/SingleResponse';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiUrl = 'https://reqres.in'

  private currentPageSubject = new BehaviorSubject<number>(1)
  private allUsersSubject = new BehaviorSubject<User[]>([])
  private searchResultsSubject = new BehaviorSubject<User[]>([])
  private currentUsersSubject = new BehaviorSubject<User[]>([])
  private searchTermSubject = new BehaviorSubject<string>('')

  currentPage$ = this.currentPageSubject.asObservable()
  allUsers$ = this.allUsersSubject.asObservable()
  searchResults$ = this.searchResultsSubject.asObservable()
  currentUsers$ = this.currentUsersSubject.asObservable()
  searchTerm$ = this.searchTermSubject.asObservable()

  constructor(private http: HttpClient) { }

  setCurrentPage(page: number) {
    this.currentPageSubject.next(page)
  }

  setSearchTerm(searchTerm: string) {
    this.searchTermSubject.next(searchTerm)
  }
  
  getUsers(page: number) {
    const cacheKey = `users_page_${page}`;
    const cachedData = localStorage.getItem(cacheKey)

    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData)
      const now = Date.now()
      const ttl = 60 * 60 * 1000

      if (now - timestamp <= ttl) {
        return of(data)
      } else {
        localStorage.removeItem(cacheKey)
      }
    }
    return this.http.get<Response>(this.apiUrl + `/api/users?page=${page}`).pipe(tap(res => {
      localStorage.setItem(cacheKey, JSON.stringify({ data: res, timestamp: Date.now() }))
    }))
  }

  getUser(id: number) {
    return this.http.get<SingleResponse>(this.apiUrl + `/api/users/${id}`)
  }

  async getAllUsers() {
    let users: User[] = []
    let hasMoreData = true, page = 1
    while (hasMoreData) {
      const res = await lastValueFrom(this.http.get<Response>(this.apiUrl + `/api/users?page=${page}`))
      if (page === res?.total_pages) hasMoreData = false
      users = users.concat(res?.data as User[])
      page++
    }
    this.allUsersSubject.next(users)
  }

  searchUsers(searchTerm: string) {
    this.allUsers$.subscribe(users => {
      const searchResults = users.filter((user: User) => {
        if (searchTerm.length !== 0) {
          const searchId = user.id.toString().includes(searchTerm)
          const searchName = (user.first_name.includes(searchTerm) || user.last_name.includes(searchTerm))
          const searchEmail = user.email.includes(searchTerm)
          
          return searchId || searchName || searchEmail
        } else {
          return null
        }
      })
      this.searchResultsSubject.next(searchResults)
    })
  }
}
